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
import formatStudent from '../utils/formatStudent';
import formatSubject from '../utils/formatSubject';

interface IRequestDTO {
  name: string;
  code: string;
  credits: number
  minimum_credits: number;
  subject_type: SubjectType;
  teacher_id: string;
  secretariat_id: string;
  pre_requisits: {
    id: string;
    name: string;
  }[];
}

interface IRequestShowSubject {
  subject_id: string;
}

interface IResponseShowSubject {
  subject: Subject;
  matriculed_students: {
    id: string;
    name: string;
    matriculation: string;
    study_shift: StudyShiftType;
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
    secretariat_id, subject_type, teacher_id, pre_requisits }: IRequestDTO): Promise<Subject> {
    
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

    const uniqueIds = Array.from(new Set(pre_requisits.map(subj => subj.id)));
    
    const uniquePreRequisits = pre_requisits.filter(subj => {
      const ids = uniqueIds.find(id => id === subj.id);
      return ids !== undefined;
    })

    const preRequisitsSubjects = await Promise.all(uniquePreRequisits.map(async pre_requisit => {

      const subjectInDb = await this.subjectRepository.findById(pre_requisit.id);
      
      if(!subjectInDb) {
        throw new AppError(`Pre requisit ${pre_requisit.name} not found.`, 404);
      }

      if(SubjectType[subjectInDb.subject_type] == 'OPTIONAL' && SubjectType[subject_type] == 'REQUIRED') {
        throw new AppError(
          `The subject ${name} is required, it cannot have the optional subject ${pre_requisit.name} as a requirement.`);
      }

      return subjectInDb;      
    }));

    const subject = await this.subjectRepository.create({
      code,
      credits,
      minimum_credits,
      name,
      secretariat_id,
      subject_type,
      teacher_id,
      pre_requisits: preRequisitsSubjects
    });

    return subject;
  }

  public async listAllSubjects(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();

    const formattedSubjects = subjects.map(subject => {
      return formatSubject(subject);
    });

    console.log(formattedSubjects)

    return formattedSubjects;
  }

  public async showSubject({ subject_id }: IRequestShowSubject): Promise<IResponseShowSubject> {
    const subject = await this.subjectRepository.findById(subject_id);

    if(!subject) {
      throw new AppError('Subject not found.', 404);
    }

    const subjectsToStudents = await this.studentToSubjectRepository.findAllBySubject(subject_id);

    const matriculedStudents = subjectsToStudents.filter(subjectToFilter => {
      if(ConceptSubjectType[subjectToFilter.concept] === 'REGISTERED') {

        if(!subjectToFilter.student) {
          throw new AppError('Student not found', 404);
        }
      
        return subjectToFilter;
      }
    }).map(subjectToStudent => {
      return formatStudent(subjectToStudent.student);
    });

    return {
      subject: formatSubject(subject),
      matriculed_students: matriculedStudents
    };
  }
}

export default SubjectsService;