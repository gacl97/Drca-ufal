import { inject, injectable } from 'tsyringe';

import AppError from '../errors/AppError';
import ConceptSubjectType from '../models/enums/ConceptSubjectType';
import SecretariatType from '../models/enums/SecretariatType';
import StudyShiftType from '../models/enums/StudyShiftType';
import SubjectType from '../models/enums/SubjectType';
import Student from '../models/Student';

import Subject from '../models/Subject';

import IDeparmentRepository from '../repositories/IDepartamentRepository';
import ISecretariatRepository from '../repositories/ISecretariatRepository';
import IStudentRepository from '../repositories/IStudentRepository';
import IStudentToSubjectRepository from '../repositories/IStudentToSubjectRepository';
import ISubjectRepository from '../repositories/ISubjectRepository';
import ITeacherRepository from '../repositories/ITeacherRepository';

interface ISubject {
  id: string;
  name: string;
}

interface IRequestDTO {
  student_id: string;
  subjects: ISubject[];
}

interface IResponseDTO {
  student: Student;
  subjects: Subject[];
}

@injectable()
class MatriculationsService {

  constructor(
    @inject('TeacherRepository')
    private teacherRepository: ITeacherRepository,
    @inject('SecretariatRepository')
    private secretariatRepository: ISecretariatRepository,
    @inject('SubjectRepository')
    private subjectRepository: ISubjectRepository,
    @inject('DepartamentRepository')
    private departamentRepository: IDeparmentRepository,
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
    
    const matriculationSubjects = await Promise.all(selectedsSubjects.map(async subject => {
     
      const paidSubject = paidSubjects.find(paidSubject1 => paidSubject1.subject.id === subject.id);
      
      if(paidSubject) {
        
        if(ConceptSubjectType[paidSubject.concept] === 'APPROVED' || ConceptSubjectType[paidSubject.concept] === 'REGISTERED') {
          throw new AppError(`Aluno já está matriculado ou já foi aprovado na matéria ${paidSubject.subject.name}`);
        }
      }
      
      const matriculationSubject = await this.studentToSubjectRepository.create({
        concept: 3,
        student,
        subject
      });
      
      return matriculationSubject.subject;
    }));

    const formattedMatriculation = matriculationSubjects.map(subject => {
      return Object.assign(subject, {
        ...subject,
        subject_type: SubjectType[subject.subject_type],
        secretariat: {
          ...subject.secretariat,
          type: SecretariatType[subject.secretariat.type]
        }
      })
    });

    const formattedStudent = Object.assign(student, {
      ...student,
      study_shift: StudyShiftType[student.study_shift],
      secretariat: {
        ...student.secretariat,
        type: SecretariatType[student.secretariat.type]
      }
    });

    return {
      student: formattedStudent,
      subjects: formattedMatriculation
    }
  }



  // public async listAllSubjects(): Promise<Subject[]> {
  //   const subjects = await this.subjectRepository.findAll();

  //   const formattedSubjects = subjects.map(subject => {
  //     return Object.assign(subject, {
  //       ...subject,
  //       subject_type: SubjectType[subject.subject_type],
  //       secretariat: {
  //         ...subject.secretariat,
  //         type: SecretariatType[subject.secretariat.type]
  //       }
  //     })
  //   });

  //   return formattedSubjects;
  // }
}

export default MatriculationsService;