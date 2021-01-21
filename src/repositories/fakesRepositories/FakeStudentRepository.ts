import { v4 as uuid } from 'uuid';

import ICreateStudentDTO from '../../dtos/ICreateStudentDTO';

import IStudentRepository from '../IStudentRepository';

import Student from '../../models/Student';

class FakeStudentRepository implements IStudentRepository {
  private students: Student[];

  constructor() {
    this.students = [];
  }

  public async create(data: ICreateStudentDTO): Promise<Student> {
    const student = new Student();

    Object.assign(student, {
      id: uuid(),
      ...data
    });

    this.students.push(student);

    return student;
  }

  public async findByCpf(cpf: string): Promise<Student | undefined> {
    const student = this.students.find(studentToFind => studentToFind.cpf === cpf);

    return student;
  }

  public async findByEmail(email: string): Promise<Student | undefined> {
    const student = this.students.find(studentToFind => studentToFind.email === email);

    return student;
  }

  public async findAll(): Promise<Student[]> {
    const students = this.students;

    return students;
  }

  public async findById(id: string): Promise<Student | undefined> {
    const student = this.students.find(studentToFind => studentToFind.id === id);

    return student;
  }
}

export default FakeStudentRepository;