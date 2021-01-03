import { container } from 'tsyringe';

import IDepartamentRepository from '../repositories/IDepartamentRepository';
import DepartamentRepository from '../repositories/DepartamentRepository';

import ISecretariatRepository from '../repositories/ISecretariatRepository';
import SecretariatRepository from '../repositories/SecretariatRepository';

import ITeacherRepository from '../repositories/ITeacherRepository';
import TeacherRepository from '../repositories/TeacherRepository';

import IStudentRepository from '../repositories/IStudentRepository';
import StudentRepository from '../repositories/StudentRepository';

import ISubjectRepository from '../repositories/ISubjectRepository';
import SubjectRepository from '../repositories/SubjectRepository';


container.registerSingleton<IDepartamentRepository>(
  'DepartamentRepository',
  DepartamentRepository
);

container.registerSingleton<ISecretariatRepository>(
  'SecretariatRepository',
  SecretariatRepository
);

container.registerSingleton<ITeacherRepository>(
  'TeacherRepository',
  TeacherRepository
);

container.registerSingleton<IStudentRepository>(
  'StudentRepository',
  StudentRepository
);

container.registerSingleton<ISubjectRepository>(
  'SubjectRepository',
  SubjectRepository
);