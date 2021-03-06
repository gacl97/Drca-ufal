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

  public async findByType(departament_id: string, type: SecretariatType): Promise<Secretariat | undefined> {
    const secretariat = await this.ormRepository.findOne({
      where: {
        type,
        departament_id
      },
      relations: ['departament']
    });

    return secretariat;
  }

  public async findAll(): Promise<Secretariat[]> {
    const secretariats = await this.ormRepository.find({
      relations: ['departament']
    });

    return secretariats;
  }

  public async findById(id: string): Promise<Secretariat | undefined> {
    const secretariat = await this.ormRepository.findOne({
      where: {
        id,
      }
    });

    return secretariat;
  }
}

export default SecretariatRepository;