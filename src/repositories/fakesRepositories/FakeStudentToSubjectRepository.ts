import { uuid } from 'uuidv4';

import ICreateStudentToSubjectDTO from '../../dtos/ICreateStudentToSubjectDTO';
import IStudentToSubjectRepository from '../IStudentToSubjectRepository';

import StudentToSubject from '../../models/StudentToSubject';

class FakeStudentToSubjectRepository implements IStudentToSubjectRepository {
  private studentToSubjects: StudentToSubject[];

  constructor() {
    this.studentToSubjects = [];
  }

  public async create(data: ICreateStudentToSubjectDTO): Promise<StudentToSubject> {
    let studentToSubject = new StudentToSubject();

    Object.assign(studentToSubject, {
      id: uuid(),
      ...data
    });

    this.studentToSubjects.push(studentToSubject);

    return studentToSubject;
  }

  public async findAllByStudent(student_id: string): Promise<StudentToSubject[]> {
    const studentToSubject = this.studentToSubjects.filter(subjectToFind => subjectToFind.student.id === student_id);

    return studentToSubject;
  }

  public async findAllBySubject(subject_id: string): Promise<StudentToSubject[]> {
    const studentToSubject = this.studentToSubjects.filter(subjectToFind => subjectToFind.subject.id === subject_id);

    return studentToSubject;
  }

  public async findOneByStudentAndSubject(student_id: string, subject_id: string): Promise<StudentToSubject | undefined> {
    const studentToSubject = this.studentToSubjects.find(subjectToFind => {
      return subjectToFind.subject.id === subject_id && subjectToFind.student.id === student_id;
    });

    return studentToSubject;
  }  
}

export default FakeStudentToSubjectRepository;