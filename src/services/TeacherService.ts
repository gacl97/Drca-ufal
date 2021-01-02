import { inject, injectable } from 'tsyringe';
import { uuid } from 'uuidv4';

import AppError from '../errors/AppError';

import Teacher from '../models/Teacher';
import IDeparmentRepository from '../repositories/IDepartamentRepository';
import ITeacherRepository from '../repositories/ITeacherRepository';

interface IRequestDTO {
  name: string;
  cpf: string;
  departament_id: string;
  email: string;
}

@injectable()
class TeacherService {

  constructor(
    @inject('TeacherRepository')
    private teacherRepository: ITeacherRepository,
    @inject('DepartamentRepository')
    private departamentRepository: IDeparmentRepository
  ) {}

  public async createTeacher({ name, cpf, departament_id, email }: IRequestDTO): Promise<Teacher> {
    let teacherExists = await this.teacherRepository.findByCpf(cpf);

    if(teacherExists) {
      throw new AppError('Cpf already in use.');
    }

    teacherExists = await this.teacherRepository.findByEmail(email);

    if(teacherExists) {
      throw new AppError('Email already in use.')
    }
    
    const matriculation = `${new Date().getFullYear().toString().substr(-2)}2${uuid().split('-')[2]}${uuid().split('-')[1]}`;
    
    const departament = await this.departamentRepository.findById(departament_id);

    if(!departament) {
      throw new AppError('Departament not found', 404);
    }

    const teacher = await this.teacherRepository.create({
      cpf,
      departament_id,
      email,
      name,
      matriculation
    });

    return teacher;
  }

  public async listAllTeachers(): Promise<Teacher[]> {
    const teachers = await this.teacherRepository.findAll();

    return teachers;
  }
}

export default TeacherService;