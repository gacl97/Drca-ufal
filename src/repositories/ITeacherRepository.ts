import ICreateTeacherDTO from "../dtos/ICreateTeacherDTO";
import Teacher from "../models/Teacher";

export default interface ITeacherRepository {
  create(data: ICreateTeacherDTO): Promise<Teacher>;
  findByCpf(cpf: string): Promise<Teacher | undefined>;
  findByEmail(email: string): Promise<Teacher | undefined>;
  findById(id: string): Promise<Teacher | undefined>;
  findAll(): Promise<Teacher[]>;
}