import { Request, Response } from 'express';
import { container } from 'tsyringe';
import StudentsService from '../services/StudentsService';

class StudentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, cpf, departament_id, email, study_shift } = request.body;

    const createStudent = container.resolve(StudentsService);

    const student = await createStudent.createStudent({
      name,
      cpf,
      departament_id,
      email,
      study_shift
    });

    return response.json(student);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listAllStudents = container.resolve(StudentsService);

    const students = await listAllStudents.listAllStudents();

    return response.json(students);
  }
}

export default StudentsController;