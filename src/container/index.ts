import { container } from 'tsyringe';

import IDepartamentRepository from '../repositories/IDepartamentRepository';
import DepartamentRepository from '../repositories/DepartamentRepository';

import ISecretariatRepository from '../repositories/ISecretariatRepository';
import SecretariatRepository from '../repositories/SecretariatRepository';


container.registerSingleton<IDepartamentRepository>(
  'DepartamentRepository',
  DepartamentRepository
);

container.registerSingleton<ISecretariatRepository>(
  'SecretariatRepository',
  SecretariatRepository
);