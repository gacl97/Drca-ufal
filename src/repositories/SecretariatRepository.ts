import { getRepository, Repository } from 'typeorm';

import ICreateSecretariatDTO from '../dtos/ICreateSecretariatDTO';
import ISecretariatRepository from './ISecretariatRepository';

import Secretariat from '../models/Secretariat';
import SecretariatType from '../models/enums/SecretariatType';

class SecretariatRepository implements ISecretariatRepository {
  private ormRepository: Repository<Secretariat>;

  constructor() {
    this.ormRepository = getRepository(Secretariat);
  }

  public async create({ type, departament_id }: ICreateSecretariatDTO): Promise<Secretariat> {
    const secretariat = this.ormRepository.create({
      type,
      departament_id
    });

    await this.ormRepository.save(secretariat);

    return secretariat;
  }

  public async findByType(type: SecretariatType): Promise<Secretariat | undefined> {
    const departament = await this.ormRepository.findOne({
      where: {
        type,
      },
      relations: ['departament']
    });

    return departament;
  }

  public async findAll(): Promise<Secretariat[]> {
    const secretariats = await this.ormRepository.find({
      relations: ['departament']
    });

    return secretariats;
  }
}

export default SecretariatRepository;