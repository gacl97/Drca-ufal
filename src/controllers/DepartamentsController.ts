import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import DepartamentsService from '../services/DepartamentsService';

class DepartamentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createDepartament = container.resolve(DepartamentsService);

    const departament = await createDepartament.createDepartament({
      name
    });

    return response.json(departament);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listAllDepartaments = container.resolve(DepartamentsService);

    const departaments = await listAllDepartaments.listAllDepartaments();

    return response.json(classToClass(departaments));
  }
}

export default DepartamentsController;