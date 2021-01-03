import { Router } from 'express';

import SubjectsController from '../controllers/SubjectsController';

const subjectsRoutes = Router();
const subjectsController = new SubjectsController();

subjectsRoutes.post('/', subjectsController.create);
subjectsRoutes.get('/', subjectsController.index);

export default subjectsRoutes;