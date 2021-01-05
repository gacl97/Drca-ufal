import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SubjectsService from '../services/SubjectsService';

class SubjectsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { 
    name,
    code,
    credits,
    minimum_credits,
    subject_type,
    teacher_id,
    secretariat_id,
  } = request.body;

    const createSubject = container.resolve(SubjectsService);

    const subject = await createSubject.createSubject({
      name,
      code,
      credits,
      minimum_credits,
      subject_type,
      teacher_id,
      secretariat_id,
    });

    return response.json(subject);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listAllSubjects = container.resolve(SubjectsService);

    const subjects = await listAllSubjects.listAllSubjects();

    return response.json(subjects);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { subject_id } = request.params;

    const showSubject = container.resolve(SubjectsService);

    const subject = await showSubject.showSubject({
      subject_id,
    });

    return response.json(subject);
  }
}

export default SubjectsController;