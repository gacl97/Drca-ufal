import { inject, injectable } from 'tsyringe';
import { uuid } from 'uuidv4';

import AppError from '../errors/AppError';
import StudyShiftType from '../models/enums/StudyShiftType';

import Student from '../models/Student';
import IDeparmentRepository from '../repositories/IDepartamentRepository';
import ISecretariatRepository from '../repositories/ISecretariatRepository';
import IStudentRepository from '../repositories/IStudentRepository';

interface IRequestDTO {
  name: string;
  cpf: string;
  departament_id: string;
  secretariat_id: string;
  email: string;
  study_shift: StudyShiftType;
}

@injectable()
class StudentsService {

  constructor(
    @inject('StudentRepository')
    private studentRepository: IStudentRepository,
    @inject('DepartamentRepository')
    private departamentRepository: IDeparmentRepository,
    @inject('SecretariatRepository')
    private secretariatRepository: ISecretariatRepository
  ) {}

  public async createStudent({ name, cpf, departament_id, email, study_shift, secretariat_id }: IRequestDTO): Promise<Student> {

    if(!StudyShiftType[study_shift]) {
      throw new AppError('Study shift not found', 404)
    }

    const secretariatExists = await this.secretariatRepository.findById(secretariat_id);

    if(!secretariatExists) {
      throw new AppError('Secretariat not found.', 404);
    }

    let studentExists = await this.studentRepository.findByCpf(cpf);

    if(studentExists) {
      throw new AppError('Cpf already in use.');
    }

    studentExists = await this.studentRepository.findByEmail(email);

    if(studentExists) {
      throw new AppError('Email already in use.')
    }
    
    const matriculation = `${new Date().getFullYear().toString().substr(-2)}2${uuid().split('-')[2]}${uuid().split('-')[1]}`;
    
    const departament = await this.departamentRepository.findById(departament_id);

    if(!departament) {
      throw new AppError('Departament not found', 404);
    }

    const student = await this.studentRepository.create({
      cpf,
      departament_id,
      email,
      name,
      matriculation,
      current_credits: 0,
      study_shift,
      secretariat_id
    });

    Object.assign(student, {
      ...student,
      study_shift: StudyShiftType[student.study_shift]
    });

    return student;
  }

  public async listAllStudents(): Promise<Student[]> {
    const students = await this.studentRepository.findAll();

    const formattedStudents = students.map(student => {
      return Object.assign(student, {
        ...student,
        study_shift: StudyShiftType[student.study_shift]
      })
    });

    return formattedStudents;
  }
}

export default StudentsService;