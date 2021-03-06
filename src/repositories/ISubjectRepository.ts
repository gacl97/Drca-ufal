import ICreateSubjectDTO from "../dtos/ICreateSubjectDTO";
import Subject from "../models/Subject";

export default interface ISubjectRepository {
  create(data: ICreateSubjectDTO): Promise<Subject>;
  findByCode(code: string): Promise<Subject | undefined>;
  findById(id: string): Promise<Subject | undefined>;
  findAll(): Promise<Subject[]>;
  findAllBySecretariat(secretariat_id: string): Promise<Subject[]>;
}