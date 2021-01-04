import { Request, Response } from 'express';
import { container } from 'tsyringe';
import MatriculationsService from '../services/MatriculationsService';

class MatriculationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { 
      student_id,
      subjects
  } = request.body;

    const createMatriculation = container.resolve(MatriculationsService);

    const matriculation = await createMatriculation.createMatriculation({
      student_id,
      subjects
    });

    return response.json(matriculation);
  }

  // public async index(request: Request, response: Response): Promise<Response> {
  //   const listAllSubjects = container.resolve(SubjectsService);

  //   const subjects = await listAllSubjects.listAllSubjects();

  //   return response.json(subjects);
  // }
}

export default MatriculationsController;