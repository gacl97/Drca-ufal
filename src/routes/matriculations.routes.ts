import { Router } from 'express';

import MatriculationsController from '../controllers/MatriculationsController';

const matriculationsRoutes = Router();
const matriculationsController = new MatriculationsController();

matriculationsRoutes.post('/', matriculationsController.create);
// matriculationsRoutes.get('/', departamentsController.index);
matriculationsRoutes.get('/proofOfRegistration', matriculationsController.show);

export default matriculationsRoutes;