import ICreateDepartamentDTO from "../dtos/ICreateDepartamentDTO";
import Departament from "../models/Departament";

export default interface IDeparmentRepository {
  create(data: ICreateDepartamentDTO): Promise<Departament>;
  findByName(name: string): Promise<Departament | undefined>;
  findAll(): Promise<Departament[]>;
  findById(id: string): Promise<Departament | undefined>;
}