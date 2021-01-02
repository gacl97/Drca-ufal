import { Router } from 'express';

import SecretariatsController from '../controllers/SecretariatsController';

const secretariatsRoutes = Router();
const secretariatsController = new SecretariatsController();

secretariatsRoutes.post('/', secretariatsController.create);
secretariatsRoutes.get('/', secretariatsController.index);

export default secretariatsRoutes;