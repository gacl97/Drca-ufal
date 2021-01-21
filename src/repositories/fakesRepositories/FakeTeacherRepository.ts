import { v4 as uuid } from 'uuid';

import ICreateTeacherDTO from '../../dtos/ICreateTeacherDTO';
import ITeacherRepository from '../ITeacherRepository';

import Teacher from '../../models/Teacher';

class FakeTeacherRepository implements ITeacherRepository {
  private teachers: Teacher[];

  constructor() {
    this.teachers = [];
  }

  public async create(data: ICreateTeacherDTO): Promise<Teacher> {
    let teacher = new Teacher();
    
    Object.assign(teacher, {
      id: uuid(),
      ...data
    });

    this.teachers.push(teacher);
    
    return teacher;
  }

  public async findByCpf(cpf: string): Promise<Teacher | undefined> {
    const teacher = this.teachers.find(teacherToFind => teacherToFind.cpf === cpf);

    return teacher;
  }

  public async findByEmail(email: string): Promise<Teacher | undefined> {
    const teacher = this.teachers.find(teacherToFind => teacherToFind.email === email);

    return teacher;
  }

  public async findAll(): Promise<Teacher[]> {
    const teacher = this.teachers;

    return teacher;
  }

  public async findById(id: string): Promise<Teacher | undefined> {
    const teacher = this.teachers.find(teacherToFind => teacherToFind.id === id);

    return teacher;
  }
}

export default FakeTeacherRepository;