import { uuid } from 'uuidv4';

import ICreateSecretariatDTO from '../../dtos/ICreateSecretariatDTO';
import ISecretariatRepository from '../ISecretariatRepository';

import Secretariat from '../../models/Secretariat';
import SecretariatType from '../../models/enums/SecretariatType';

class FakeSecretariatRepository implements ISecretariatRepository {
  private secretariats: Secretariat[];

  constructor() {
    this.secretariats = [];
  }

  public async create({ type, departament_id }: ICreateSecretariatDTO): Promise<Secretariat> {
    const secretariat = new Secretariat();

    Object.assign(secretariat, {
      id: uuid(),
      type,
      departament_id
    });

    this.secretariats.push(secretariat);

    return secretariat;
  }

  public async findByType(departament_id: string, type: SecretariatType): Promise<Secretariat | undefined> {
    const secretariat = this.secretariats.find(secretariatToFind => {
      return secretariatToFind.type === type && secretariatToFind.departament_id === departament_id;
    });

    return secretariat;
  }

  public async findAll(): Promise<Secretariat[]> {
    const secretariats = this.secretariats;

    return secretariats;
  }

  public async findById(id: string): Promise<Secretariat | undefined> {
    const secretariat = this.secretariats.find(secretariatToFind => {
      return secretariatToFind.id === id;
    });

    return secretariat;
  }
}

export default FakeSecretariatRepository;