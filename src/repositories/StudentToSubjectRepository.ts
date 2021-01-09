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

  public async findOneByStudentAndSubject(student_id: string, subject_id: string): Promise<StudentToSubject | undefined> {
    const studentToSubject = await this.ormRepository.findOne({
      where: {
        subject: subject_id,
        student: student_id
      }
    });

    return studentToSubject;
  }  
}

export default StudentToSubjectRepository;