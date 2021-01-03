import { getRepository, Repository } from 'typeorm';

import ICreateStudentDTO from '../dtos/ICreateStudentDTO';
import IStudentRepository from './IStudentRepository';

import Student from '../models/Student';

class StudentRepository implements IStudentRepository {
  private ormRepository: Repository<Student>;

  constructor() {
    this.ormRepository = getRepository(Student);
  }

  public async create(data: ICreateStudentDTO): Promise<Student> {
    const student = this.ormRepository.create(data);

    await this.ormRepository.save(student);

    return student;
  }

  public async findByCpf(cpf: string): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({
      where: {
        cpf,
      }
    });

    return student;
  }

  public async findByEmail(email: string): Promise<Student | undefined> {
    const student = await this.ormRepository.findOne({
      where: {
        email,
      }
    });

    return student;
  }

  public async findAll(): Promise<Student[]> {
    const students = await this.ormRepository.find({
      relations: ['departament']
    });

    return students;
  }

  // public async findById(id: string): Promise<Departament | undefined> {
  //   const departament = await this.ormRepository.findOne({
  //     where: {
  //       id,
  //     }
  //   });

  //   return departament;
  // }
}

export default StudentRepository;