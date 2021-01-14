import AppError from "../errors/AppError";

import DepartamentsService from "./DepartamentsService";
import FakeDepartamentRepository from "../repositories/fakesRepositories/FakeDepartamentRepository";

let departamentService: DepartamentsService;
let fakeDepartamentRepository: FakeDepartamentRepository;

describe('CreateDepartaments', () => {
  beforeEach(() => {
    fakeDepartamentRepository = new FakeDepartamentRepository();

    departamentService = new DepartamentsService(
      fakeDepartamentRepository
    );
  });

  it('Should be able to create a new Departament', async () => {
    const departament = await departamentService.createDepartament({
      name: 'Instituto de computação'
    });

    expect(departament).toHaveProperty('id');
  });

  it('Should not be able to create a new Departament with the same name as another', async () => {
    await departamentService.createDepartament({
      name: 'Instituto de computação'
    });

    expect(departamentService.createDepartament({
      name: 'Instituto de computação'
    })).rejects.toBeInstanceOf(AppError);
  });
});

describe('ListDepartaments', () => {
  beforeEach(() => {
    fakeDepartamentRepository = new FakeDepartamentRepository();

    departamentService = new DepartamentsService(
      fakeDepartamentRepository
    );
  });

  it('Should be able to list departaments', async () => {
    const departament1 = await departamentService.createDepartament({
      name: 'Instituto de computação'
    });

    const departament2 = await departamentService.createDepartament({
      name: 'Instituto de matemática'
    });

    const departaments = await departamentService.listAllDepartaments();

    expect(departaments).toEqual([departament1, departament2]);
  });
});