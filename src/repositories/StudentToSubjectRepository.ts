import { getRepository, Repository } from 'typeorm';

import ICreateStudentToSubjectDTO from '../dtos/ICreateStudentToSubjectDTO';
import IStudentToSubjectRepository from './IStudentToSubjectRepository';

import StudentToSubject from '../models/StudentToSubject';

class StudentToSubjectRepository implements IStudentToSubjectRepository {
  private ormRepository: Repository<StudentToSubject>;

  constructor() {
    this.ormRepository = getRepository(StudentToSubject);
  }

  public async create(data: ICreateStudentToSubjectDTO): Promise<StudentToSubject> {
    const studentToSubject = this.ormRepository.create(data);

    await this.ormRepository.save(studentToSubject);

    return studentToSubject;
  }

  public async findAllByStudent(student_id: string): Promise<StudentToSubject[]> {
    const studentToSubject = await this.ormRepository.find({
      where: {
        student: student_id
      },
      relations: ['subject']
    });

    return studentToSubject;
  }

  public async findAllBySubject(subject_id: string): Promise<StudentToSubject[]> {
    const studentToSubject = await this.ormRepository.find({
      where: {
        subject: subject_id
      },
      relations: ['student']
    });

    return studentToSubject;
  }

  

  // public async findByEmail(email: string): Promise<Student | undefined> {
  //   const student = await this.ormRepository.findOne({
  //     where: {
  //       email,
  //     }
  //   });

  //   return student;
  // }

  // public async findAll(): Promise<Student[]> {
  //   const students = await this.ormRepository.find({
  //     relations: ['departament', 'secretariat']
  //   });

  //   return students;
  // }

  // public async findById(id: string): Promise<Student | undefined> {
  //   const student = await this.ormRepository.findOne({
  //     where: {
  //       id,
  //     }
  //   });

  //   return student;
  // }
}

export default StudentToSubjectRepository;