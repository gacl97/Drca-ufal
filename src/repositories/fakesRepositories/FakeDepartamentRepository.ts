import { v4 as uuid } from 'uuid';
import ICreateDepartamentDTO from '../../dtos/ICreateDepartamentDTO';
import IDeparmentRepository from '../IDepartamentRepository';

import Departament from '../../models/Departament';

class FakeDepartamentRepository implements IDeparmentRepository {
  private departaments: Departament[];

  constructor() {
    this.departaments = [];
  }

  public async create(data: ICreateDepartamentDTO): Promise<Departament> {
    const departament = new Departament();

    Object.assign(departament, {
      id: uuid(),
      ...data
    })

    this.departaments.push(departament)

    return departament;
  }

  public async findByName(name: string): Promise<Departament | undefined> {
    const departament = this.departaments.find(departamentToFind => {
      return departamentToFind.name === name;
    });

    return departament;
  }

  public async findAll(): Promise<Departament[]> {
    const departaments = this.departaments;

    return departaments;
  }

  public async findById(id: string): Promise<Departament | undefined> {
    const departament = this.departaments.find(departamentToFind => {
      return departamentToFind.id === id;
    });

    return departament;
  }
}

export default FakeDepartamentRepository;