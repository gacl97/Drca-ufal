import ICreateStudentToSubjectDTO from "../dtos/ICreateStudentToSubjectDTO";
import StudentToSubject from "../models/StudentToSubject";

export default interface IStudentToSubjectRepository {
  create(data: ICreateStudentToSubjectDTO): Promise<StudentToSubject>;
  findAllByStudent(student_id: string): Promise<StudentToSubject[]>;
  findAllBySubject(subject_id: string): Promise<StudentToSubject[]>;
  findOneByStudentAndSubject(student_id: string, subject_id: string): Promise<StudentToSubject | undefined>;
}