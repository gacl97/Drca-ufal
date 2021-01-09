import {Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import SecretariatsService from '../services/SecretariatsService';

class SecretariatsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { type, departament_id } = request.body;

    const createSecretariat = container.resolve(SecretariatsService);

    const secretariat = await createSecretariat.createSecretariat({
      type,
      departament_id
    });

    return response.json(secretariat);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listAllSecretariats = container.resolve(SecretariatsService);

    const secretariats = await listAllSecretariats.listAllSecretariats();

    return response.json(classToClass(secretariats));
  }
}

export default SecretariatsController;