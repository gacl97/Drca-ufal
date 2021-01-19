import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '../errors/AppError';

import Departament from "../models/Departament";
import IDeparmentRepository from '../repositories/IDepartamentRepository';

interface IRequestDTO {
  name: string;
}

@injectable()
class DepartamentsService {

  constructor(
    @inject('DepartamentRepository')
    private departamentRepository: IDeparmentRepository,
  ) {}

  public async createDepartament({ name }: IRequestDTO): Promise<Departament> {
    const departamentExists = await this.departamentRepository.findByName(name);
    
    if(departamentExists) {
      throw new AppError('This departament already exists');
    } 

    const departament = this.departamentRepository.create({
      name
    });

    return departament;
  }

  public async listAllDepartaments(): Promise<Departament[]> {
    const departaments = await this.departamentRepository.findAll();

    return departaments;
  }
}

export default DepartamentsService;