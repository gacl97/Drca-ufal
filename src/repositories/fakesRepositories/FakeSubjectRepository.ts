import { v4 as uuid } from 'uuid';

import ICreateSubjectDTO from '../../dtos/ICreateSubjectDTO';
import ISubjectRepository from '../ISubjectRepository';

import Subject from '../../models/Subject';

class FakeSubjectRepository implements ISubjectRepository {
  private subjects: Subject[];

  constructor() {
    this.subjects = [];
  }

  public async create(data: ICreateSubjectDTO): Promise<Subject> {
    let subject = new Subject();

    Object.assign(subject, {
      id: uuid(),
      ...data
    });
    
    this.subjects.push(subject);
    
    return subject;
  }

  public async findByCode(code: string): Promise<Subject | undefined> {
    const subject = this.subjects.find(subjectToFind => subjectToFind.code === code);

    return subject;
  }

  public async findAll(): Promise<Subject[]> {
    const subjects = this.subjects;

    return subjects;
  }

  public async findById(id: string): Promise<Subject | undefined> {
    const subject = this.subjects.find(subjectToFind => subjectToFind.id === id);

    return subject;
  }

  public async findAllBySecretariat(secretariat_id: string): Promise<Subject[]> {
    const subjects = this.subjects.filter(subjectToFind => subjectToFind.secretariat_id === secretariat_id);

    return subjects;
  }
}

export default FakeSubjectRepository;