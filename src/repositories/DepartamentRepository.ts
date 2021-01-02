import { getRepository, Repository } from 'typeorm';

import ICreateDepartamentDTO from '../dtos/ICreateDepartamentDTO';
import IDeparmentRepository from './IDepartamentRepository';

import Departament from '../models/Departament';

class DepartamentRepository implements IDeparmentRepository {
  private ormRepository: Repository<Departament>;

  constructor() {
    this.ormRepository = getRepository(Departament);
  }

  public async create(data: ICreateDepartamentDTO): Promise<Departament> {
    const departament = this.ormRepository.create(data);

    await this.ormRepository.save(departament);

    return departament;
  }

  public async findByName(name: string): Promise<Departament | undefined> {
    const departament = await this.ormRepository.findOne({
      where: {
        name,
      }
    });

    return departament;
  }

  public async findAll(): Promise<Departament[]> {
    const departaments = await this.ormRepository.find();

    return departaments;
  }

  public async findById(id: string): Promise<Departament | undefined> {
    const departament = await this.ormRepository.findOne({
      where: {
        id,
      }
    });

    return departament;
  }
}

export default DepartamentRepository;