import { Request, Response } from 'express';
import { container } from 'tsyringe';
import TeacherService from '../services/TeacherService';

class TeachersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { 
      name,
      email,
      cpf,
      departament_id 
    } = request.body;

    const createTeacher = container.resolve(TeacherService);

    const teacher = await createTeacher.createTeacher({
      name,
      cpf,
      departament_id,
      email
    });

    return response.json(teacher);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listAllTeachers = container.resolve(TeacherService);

    const teachers = await listAllTeachers.listAllTeachers();

    return response.json(teachers);
  }
}

export default TeachersController;