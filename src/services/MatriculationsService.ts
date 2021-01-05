import { inject, injectable } from 'tsyringe';

import AppError from '../errors/AppError';
import ConceptSubjectType from '../models/enums/ConceptSubjectType';
import SecretariatType from '../models/enums/SecretariatType';
import Student from '../models/Student';

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
    
    selectedsSubjects.forEach( subject => {
      const paidSubject = paidSubjects.find(paidSubject1 => paidSubject1.subject.id === subject.id);
      
      if(paidSubject) {
        
        if(ConceptSubjectType[paidSubject.concept] === 'APPROVED' || ConceptSubjectType[paidSubject.concept] === 'REGISTERED') {
          throw new AppError(`Aluno já está matriculado ou já foi aprovado na matéria ${paidSubject.subject.name}`);
        }
      }
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
    
    const formattedStudent = formatStudent(student);

    return {
      student: {
        name: formattedStudent.name,
        matriculation: formattedStudent.matriculation,
        type: formattedStudent.secretariat.type,
        departament: formattedStudent.departament.name
      },
      subjects: subjectsMatriculated
    };
  }
}

export default MatriculationsService;