import { getRepository, Repository } from 'typeorm';

import ICreateSubjectDTO from '../dtos/ICreateSubjectDTO';
import ISubjectRepository from './ISubjectRepository';

import Subject from '../models/Subject';

class SubjectRepository implements ISubjectRepository {
  private ormRepository: Repository<Subject>;

  constructor() {
    this.ormRepository = getRepository(Subject);
  }

  public async create(data: ICreateSubjectDTO): Promise<Subject> {
    const subject = this.ormRepository.create(data);

    await this.ormRepository.save(subject);

    return subject;
  }

  public async findByCode(code: string): Promise<Subject | undefined> {
    const subject = await this.ormRepository.findOne({
      where: {
        code,
      }
    });

    return subject;
  }

  public async findAll(): Promise<Subject[]> {
    const subjects = await this.ormRepository.find({
      relations: ['secretariat', 'teacher', 'pre_requisits']
    });

    return subjects;
  }

  public async findById(id: string): Promise<Subject | undefined> {
    const subject = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: ['teacher', 'pre_requisits']
    });

    return subject;
  }

  public async findAllBySecretariat(secretariat_id: string): Promise<Subject[]> {
    const subjects = await this.ormRepository.find({
      where: {
        secretariat_id
      },
      relations: ['pre_requisits']
    });

    return subjects;
  }
}

export default SubjectRepository;