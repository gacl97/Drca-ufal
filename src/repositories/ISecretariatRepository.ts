import Secretariat from "../models/Secretariat";

import SecretariatType from '../models/enums/SecretariatType';
import ICreateSecretariatDTO from "../dtos/ICreateSecretariatDTO";

export default interface ISecretariatRepository {
  create(data: ICreateSecretariatDTO): Promise<Secretariat>;
  findByType(type: SecretariatType): Promise<Secretariat | undefined>;
  findById(id: string): Promise<Secretariat | undefined>;
  findAll(): Promise<Secretariat[]>;
}