import { Router } from 'express';

import departamentsRoutes from './departaments.routes';
import secretariatsRoutes from './secretariats.routes';
import teachersRoutes from './teachers.routes';

const routes = Router();

routes.use('/departaments', departamentsRoutes);
routes.use('/secretariats', secretariatsRoutes);
routes.use('/teachers', teachersRoutes);

export default routes;