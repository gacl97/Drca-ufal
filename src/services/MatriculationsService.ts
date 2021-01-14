import { inject, injectable } from 'tsyringe';

import AppError from '../errors/AppError';
import ConceptSubjectType from '../models/enums/ConceptSubjectType';
import SecretariatType from '../models/enums/SecretariatType';
import Student from '../models/Student';
import StudentToSubject from '../models/StudentToSubject';

import Subject from '../models/Subject';

import IStudentRepository from '../repositories/IStudentRepository';
import IStudentToSubjectRepository from '../repositories/IStudentToSubjectRepository';
import ISubjectRepository from '../repositories/ISubjectRepository';
import ITeacherRepository from '../repositories/ITeacherRepository';

import formatStudent from '../utils/formatStudent';
import formatSubject from '../utils/formatSubject';

interface IRequestDTO {
  student_id: string;
  subjects: {
    id: string;
    name: string;
  }[];
}

interface IResponseDTO {
  student: Student;
  subjects: Subject[];
}

interface IRequestShowMatriculationDTO {
  student_id: string;
}

interface IResponseShowMatriculationDTO {
  student: {
    name: string;
    matriculation: string;
    type: SecretariatType;
    departament: string;
  };
  subjects: {
    name: string;
    code: string;
    teacher: string;
  }[];
}

interface IRequestUpdateGradeDTO {
  student_id: string;
  subject_id: string;
  ab1: number;
  ab2: number;
  reavaluation: number;
}

@injectable()
class MatriculationsService {

  constructor(
    @inject('TeacherRepository')
    private teacherRepository: ITeacherRepository,
    @inject('SubjectRepository')
    private subjectRepository: ISubjectRepository,
    @inject('StudentRepository')
    private studentRepository: IStudentRepository,
    @inject('StudentToSubjectRepository')
    private studentToSubjectRepository: IStudentToSubjectRepository,
  ) {}

  public async createMatriculation({ student_id, subjects }: IRequestDTO): Promise<IResponseDTO> {
    const student = await this.studentRepository.findById(student_id);
    
    if(!student) {
      throw new AppError('Student not found', 404);
    }

    const subjectsInDatabase = await this.subjectRepository.findAll();
    
    const selectedsSubjects = subjects.map(subject => {
      const subjectExists = subjectsInDatabase.find(subjectInDb => subjectInDb.id === subject.id);

      if(!subjectExists) {
        throw new AppError(`Subject: ${subject.name} not found`, 404);
      }

      if(subjectExists.secretariat.departament_id !== student.departament_id) {
        throw new AppError(`Selected subject ${subjectExists.name} is not from the same department as the student`);
      }
      
      if(student.current_credits < subjectExists.minimum_credits) {
        throw new AppError(`O aluno não possui os créditos mínimos necessários para cursar a matéria ${subjectExists.name}`);
      }

      if(SecretariatType[student.secretariat.type] === 'GRADUATION' && SecretariatType[subjectExists.secretariat.type] === 'POSTGRADUATE') {
        if(student.current_credits < 170) {
          throw new AppError('Student does not have the minimum number of credits (170) to take post-graduate courses');
        }
      }

      if(SecretariatType[student.secretariat.type] === 'POSTGRADUATE' && SecretariatType[subjectExists.secretariat.type] === 'GRADUATION') {
        throw new AppError('Graduate students cannot enroll in undergraduate courses');
      }
      
      return subjectExists;
    });

    const paidSubjects = await this.studentToSubjectRepository.findAllByStudent(student.id);
    
    selectedsSubjects.forEach(subject => {
      const isPaidSubject = paidSubjects.find(subject1 => subject1.subject.id === subject.id);
      
      if(isPaidSubject) {
        if(ConceptSubjectType[isPaidSubject.concept] === 'APPROVED' || ConceptSubjectType[isPaidSubject.concept] === 'REGISTERED') {
          throw new AppError(`Aluno já está matriculado ou já foi aprovado na matéria ${isPaidSubject.subject.name}`);
        }
      }

      subject.pre_requisits.forEach(pre_requisit => {

        if(student.current_credits < pre_requisit.minimum_credits) {
          throw new AppError(`Aluno não possui os créditos minimos para matricular na matéria ${pre_requisit.name}.`);
        }

        const isPaidPreRequist = paidSubjects.find(subject1 => subject1.subject.id === pre_requisit.id);

        if(isPaidPreRequist) {
          if(ConceptSubjectType[isPaidPreRequist.concept] !== 'APPROVED' && ConceptSubjectType[isPaidPreRequist.concept] !== 'REGISTERED') {
            throw new AppError(`Aluno não está matriculado ou não foi aprovado na matéria ${isPaidPreRequist.subject.name}`);
          }
        }
      });
    });

    const matriculationSubjects = await Promise.all(selectedsSubjects.map(async subject => {
      
      const matriculationSubject = await this.studentToSubjectRepository.create({
        concept: 3,
        student,
        subject
      });
      
      return matriculationSubject.subject;
    }));

    const formattedMatriculation = matriculationSubjects.map(subject => {
      return formatSubject(subject);
    });

    const formattedStudent = formatStudent(student);

    return {
      student: formattedStudent,
      subjects: formattedMatriculation
    }
  }

  public async showMatriculation({ student_id }: IRequestShowMatriculationDTO): Promise<IResponseShowMatriculationDTO> {
    const student = await this.studentRepository.findById(student_id);

    if(!student) {
      throw new AppError('Student not found', 404);
    }

    const studentToSubjectInfo = await this.studentToSubjectRepository.findAllByStudent(student_id);

    const subjectsMatriculated = await Promise.all(studentToSubjectInfo.map(async data => {
      const teacher = await this.teacherRepository.findById(data.subject.teacher_id);

      if(!teacher) {
        throw new AppError('Teacher not found', 404);
      }

      return {
        name: data.subject.name,
        code: data.subject.code,
        teacher: teacher.name,
      }
    }));
    
    const { name, matriculation, secretariat, departament } = formatStudent(student);

    return {
      student: {
        name,
        matriculation,
        type: secretariat.type,
        departament: departament.name
      },
      subjects: subjectsMatriculated
    };
  }

  // public async updateGrade({ student_id, subject_id, ab1, ab2, reavaluation }: IRequestUpdateGradeDTO): Promise<void> {

    // if(ab1 > 10 || ab2 > 10 || reavaluation > 10) {
    //   throw new AppError('Grades cannot be greater than 10.');
    // }

    // if(ab1 < 0 || ab2 < 0 || reavaluation < 0) {
    //   throw new AppError('Grades cannot be less than 0.');
    // }

    // const student = await this.studentRepository.findById(student_id);

    // if(!student) {
    //   throw new AppError('Student not found.', 404);
    // }

    // const subjectInfos = await this.studentToSubjectRepository.findOneByStudentAndSubject(student_id, subject_id);

    // if(!subjectInfos) {
    //   throw new AppError('Student is not enrolled in this subject.');
    // }

    // if(subjectInfos.ab1 === null && ab1 === undefined) {
    //   throw new AppError('To update other grades it is necessary to register ab1 first.');
    // }
    
    // if(subjectInfos.ab2 === null && ab2 === undefined && reavaluation >= 0) {
    //   throw new AppError('To register the revaluation grade it is necessary to register the ab2 grade first.');
    // }
    
    // if(reavaluation >= 0) {
    //   if()
    // }
    // console.log('--> ', subjectInfos);
    // if()

    // Object.assign(subjectInfos, {
    //   ...subjectInfos,
    //   ab1,
    //   ab2
    // });
  // }
}

export default MatriculationsService;