import { inject, injectable } from 'tsyringe';
import AppError from '../errors/AppError';

import SecretariatType from '../models/enums/SecretariatType';
import Secretariat from '../models/Secretariat';
import IDeparmentRepository from '../repositories/IDepartamentRepository';
import ISecretariatRepository from '../repositories/ISecretariatRepository';

interface IRequestDTO {
  type: SecretariatType;
  departament_id: string;
}

@injectable()
class SecretariatsService {

  constructor(
    @inject('SecretariatRepository')
    private secretariatRepository: ISecretariatRepository,
    @inject('DepartamentRepository')
    private departamentRepository: IDeparmentRepository
  ) {}

  public async createSecretariat({ type, departament_id }: IRequestDTO): Promise<Secretariat> {

    if(!SecretariatType[type]) {
      throw new AppError('Type of secretariat not found', 404)
    }

    const secreatariatExists = await this.secretariatRepository.findByType(type);

    if(secreatariatExists) {
      throw new AppError('This secretariat already exists.');
    }

    const departamentExists = await this.departamentRepository.findById(departament_id);

    if(!departamentExists) {
      throw new AppError('Departament not found', 404);
    }

    const secretariat = await this.secretariatRepository.create({
      type,
      departament_id
    });

    Object.assign(secretariat, {
      ...secretariat,
      type: SecretariatType[secretariat.type]
    })

    return secretariat;
  }

  public async listAllSecretariats(): Promise<Secretariat[]> {
    const secretariats = await this.secretariatRepository.findAll();

    const formatedSecretariats = secretariats.map(secretariat => {
      return Object.assign(secretariat, {
        ...secretariat,
        type: SecretariatType[secretariat.type]
      })
    });

    return formatedSecretariats;
  }
}

export default SecretariatsService;