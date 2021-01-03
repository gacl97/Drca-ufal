import { Router } from 'express';

import StudentsController from '../controllers/StudentsController';

const studentsRoutes = Router();
const studentsController = new StudentsController();

studentsRoutes.post('/', studentsController.create);
studentsRoutes.get('/', studentsController.index);

export default studentsRoutes;