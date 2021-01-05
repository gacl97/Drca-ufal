import { inject, injectable } from 'tsyringe';

import AppError from '../errors/AppError';
import ConceptSubjectType from '../models/enums/ConceptSubjectType';
import StudyShiftType from '../models/enums/StudyShiftType';
import SubjectType from '../models/enums/SubjectType';

import Subject from '../models/Subject';
import ISecretariatRepository from '../repositories/ISecretariatRepository';
import IStudentToSubjectRepository from '../repositories/IStudentToSubjectRepository';
import ISubjectRepository from '../repositories/ISubjectRepository';
import ITeacherRepository from '../repositories/ITeacherRepository';
import formatSubject from '../utils/formatSubject';

interface IRequestDTO {
  name: string;
  code: string;
  credits: number
  minimum_credits: number;
  subject_type: SubjectType;
  teacher_id: string;
  secretariat_id: string;
}

interface IRequestShowSubject {
  subject_id: string;
}

interface IResponseShowSubject {
  subject: {
    id: string;
    name: string;
    code: string;
    credits: number;
    minimum_credits: number;
    subject_type: SubjectType;
  }
  teacher: {
    id: string;
    name: string;
  };
  matriculed_students: {
    id: string;
    name: string;
    matriculation: string;
    study_shift: string;
  }[];
}

@injectable()
class SubjectsService {

  constructor(
    @inject('TeacherRepository')
    private teacherRepository: ITeacherRepository,
    @inject('SecretariatRepository')
    private secretariatRepository: ISecretariatRepository,
    @inject('SubjectRepository')
    private subjectRepository: ISubjectRepository,
    @inject('StudentToSubjectRepository')
    private studentToSubjectRepository: IStudentToSubjectRepository,
  ) {}

  public async createSubject({ name, code, credits, minimum_credits,
    secretariat_id, subject_type, teacher_id }: IRequestDTO): Promise<Subject> {
    
    if(!SubjectType[subject_type]) {
      throw new AppError('Subject type not found', 404);
    }

    if(credits < 0 || credits > 120) {
      throw new AppError('Credits must be greater than or equal to 0 and less than or equal to 120.');
    }

    if(minimum_credits < 0) {
      throw new AppError('Minimum credit must be greater than or equal to 0.');
    }

    const subjectCodeExists = await this.subjectRepository.findByCode(code);
    
    if(subjectCodeExists) {
      throw new AppError('Subject code is already in use.');
    }

    const teacherExists = await this.teacherRepository.findById(teacher_id);

    if(!teacherExists) {
      throw new AppError('Teacher not found.', 404);
    }

    const secretariatExists = await this.secretariatRepository.findById(secretariat_id);

    if(!secretariatExists) {
      throw new AppError('Secretariat not found.', 404);
    }

    const subject = await this.subjectRepository.create({
      code,
      credits,
      minimum_credits,
      name,
      secretariat_id,
      subject_type,
      teacher_id
    });

    return subject;
  }

  public async listAllSubjects(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();

    const formattedSubjects = subjects.map(subject => {
      return formatSubject(subject);
    });

    return formattedSubjects;
  }

  public async showSubject({ subject_id }: IRequestShowSubject): Promise<IResponseShowSubject> {
    const subject = await this.subjectRepository.findById(subject_id);

    if(!subject) {
      throw new AppError('Subject not found.', 404);
    }

    const subjectsToStudents = await this.studentToSubjectRepository.findAllBySubject(subject_id);

    const matriculedStudents = subjectsToStudents.filter(subject1 => {
      if(ConceptSubjectType[subject1.concept] === 'REGISTERED') {
        if(!subject1.student) {
          throw new AppError('Student not found', 404);
        }
      
        return subject1;
      }
    });

    const formattedMatriculedStudents = matriculedStudents.map(subject1 => {
      return {
        id: subject1.student.id,
        name: subject1.student.name,
        matriculation: subject1.student.matriculation,
        study_shift: StudyShiftType[subject1.student.study_shift]
      }
    })

    const formattedSubject = formatSubject(subject);

    const subjectToReturn =  {
      id: formattedSubject.id,
      name: formattedSubject.name,
      code: formattedSubject.code,
      credits: formattedSubject.credits,
      minimum_credits: formattedSubject.minimum_credits,
      subject_type: formattedSubject.subject_type
    }

    const teacherToReturn = {
      id: formattedSubject.teacher.id,
      name: formattedSubject.name
    }

    return {
      subject: subjectToReturn,
      teacher: teacherToReturn,
      matriculed_students: formattedMatriculedStudents
    };
  }
}

export default SubjectsService;