import { Router } from 'express';

import DepartamentsController from '../controllers/DepartamentsController';

const departamentsRoutes = Router();
const departamentsController = new DepartamentsController();

departamentsRoutes.post('/', departamentsController.create);
departamentsRoutes.get('/', departamentsController.index);

export default departamentsRoutes;