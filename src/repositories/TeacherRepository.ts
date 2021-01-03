import { getRepository, Repository } from 'typeorm';

import ICreateTeacherDTO from '../dtos/ICreateTeacherDTO';
import ITeacherRepository from './ITeacherRepository';

import Teacher from '../models/Teacher';

class TeacherRepository implements ITeacherRepository {
  private ormRepository: Repository<Teacher>;

  constructor() {
    this.ormRepository = getRepository(Teacher);
  }

  public async create(data: ICreateTeacherDTO): Promise<Teacher> {
    const teacher = this.ormRepository.create(data);

    await this.ormRepository.save(teacher);

    return teacher;
  }

  public async findByCpf(cpf: string): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({
      where: {
        cpf,
      }
    });

    return teacher;
  }

  public async findByEmail(email: string): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({
      where: {
        email,
      }
    });

    return teacher;
  }

  public async findAll(): Promise<Teacher[]> {
    const teacher = await this.ormRepository.find({
      relations: ['departament']
    });

    return teacher;
  }

  public async findById(id: string): Promise<Teacher | undefined> {
    const teacher = await this.ormRepository.findOne({
      where: {
        id,
      }
    });

    return teacher;
  }
}

export default TeacherRepository;