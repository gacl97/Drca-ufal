import { Router } from 'express';

import TeachersController from '../controllers/TeachersController';

const teachersRoutes = Router();
const teachersController = new TeachersController();

teachersRoutes.post('/', teachersController.create);
teachersRoutes.get('/', teachersController.index);

export default teachersRoutes;