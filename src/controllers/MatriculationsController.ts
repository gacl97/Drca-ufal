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

  public async show(request: Request, response: Response): Promise<Response> {
    const { student_id } = request.params;

    const getProofOfRegistration = container.resolve(MatriculationsService);

    const proofOfRegistration = await getProofOfRegistration.showMatriculation({
      student_id
    });

    return response.json(proofOfRegistration);
  }

  // public async update(request: Request, response: Response): Promise<Response> {
  //   const { student_id, subject_id, ab1, ab2, reavaluation } = request.body;

  //   const updateGrade = container.resolve(MatriculationsService);

  //   const subjectUpdate = await updateGrade.updateGrade({
  //     student_id,
  //     subject_id,
  //     ab1,
  //     ab2,
  //     reavaluation
  //   });

  //   return response.json(subjectUpdate);
  // }
}

export default MatriculationsController;