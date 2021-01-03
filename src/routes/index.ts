import { Router } from 'express';

import departamentsRoutes from './departaments.routes';
import secretariatsRoutes from './secretariats.routes';
import teachersRoutes from './teachers.routes';
import studentsRoutes from './students.routes';
import subjectsRoutes from './subjects.routes';

const routes = Router();

routes.use('/departaments', departamentsRoutes);
routes.use('/secretariats', secretariatsRoutes);
routes.use('/teachers', teachersRoutes);
routes.use('/students', studentsRoutes);
routes.use('/subjects', subjectsRoutes);

export default routes;