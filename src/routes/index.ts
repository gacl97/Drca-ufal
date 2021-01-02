import { Router } from 'express';

import departamentsRoutes from './departaments.routes';
import secretariatsRoutes from './secretariats.routes';

const routes = Router();

routes.use('/departaments', departamentsRoutes);
routes.use('/secretariats', secretariatsRoutes);

export default routes;