import { Router } from 'express';

import MatriculationsController from '../controllers/MatriculationsController';

const matriculationsRoutes = Router();
const matriculationsController = new MatriculationsController();

matriculationsRoutes.post('/', matriculationsController.create);
matriculationsRoutes.get('/proofOfRegistration/:student_id', matriculationsController.show);
// matriculationsRoutes.patch('/grades', matriculationsController.update);

export default matriculationsRoutes;