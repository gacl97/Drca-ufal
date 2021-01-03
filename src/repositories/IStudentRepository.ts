import ICreateStudentDTO from "../dtos/ICreateStudentDTO";
import Student from "../models/Student";

export default interface IStudentRepository {
  create(data: ICreateStudentDTO): Promise<Student>;
  findByCpf(cpf: string): Promise<Student | undefined>;
  findByEmail(email: string): Promise<Student | undefined>;
  findAll(): Promise<Student[]>;
}