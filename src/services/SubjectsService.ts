import { inject, injectable } from 'tsyringe';

import AppError from '../errors/AppError';
import SecretariatType from '../models/enums/SecretariatType';
import SubjectType from '../models/enums/SubjectType';

import Subject from '../models/Subject';
import ISecretariatRepository from '../repositories/ISecretariatRepository';
import ISubjectRepository from '../repositories/ISubjectRepository';
import ITeacherRepository from '../repositories/ITeacherRepository';

interface IRequestDTO {
  name: string;
  code: string;
  credits: number
  minimum_credits: number;
  subject_type: SubjectType;
  teacher_id: string;
  secretariat_id: string;
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
      return Object.assign(subject, {
        ...subject,
        subject_type: SubjectType[subject.subject_type],
        secretariat: {
          ...subject.secretariat,
          type: SecretariatType[subject.secretariat.type]
        }
      })
    });

    return formattedSubjects;
  }
}

export default SubjectsService;