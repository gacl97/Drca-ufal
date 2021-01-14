import AppError from "../errors/AppError";

import FakeDepartamentRepository from "../repositories/fakesRepositories/FakeDepartamentRepository";
import FakeTeacherRepository from "../repositories/fakesRepositories/FakeTeacherRepository";
import TeacherService from "./TeacherService";


let fakeDepartamentRepository: FakeDepartamentRepository;
let fakeTeacherRepository: FakeTeacherRepository;
let teachersService: TeacherService;

describe('CreateTeachers', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();

    teachersService = new TeacherService(
      fakeTeacherRepository,
      fakeDepartamentRepository
    );
  });

  it('Should be able to create a new teacher', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const teacher = await teachersService.createTeacher({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      departament_id: departament.id
    });

    expect(teacher).toHaveProperty('id');
  });

  it('Should not be able to create a new teacher with the same cpf from another teacher', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    await fakeTeacherRepository.create({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      departament_id: departament.id,
      matriculation: '1111'
    });

    expect(teachersService.createTeacher({
      cpf: '111111111',
      email: 'johnDoe2@mail.com',
      name: 'John Doe Segundo',
      departament_id: departament.id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new teacher with the same email from another teacher', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    await fakeTeacherRepository.create({
      cpf: '111111123211',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      departament_id: departament.id,
      matriculation: '1111'
    });

    expect(teachersService.createTeacher({
      cpf: '1111111323211',
      email: 'johnDoe@mail.com',
      name: 'John Doe Segundo',
      departament_id: departament.id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new teacher for a department that does not exist', async () => {
    
    expect(teachersService.createTeacher({
      cpf: '111111111',
      email: 'johnDoe2@mail.com',
      name: 'John Doe Segundo',
      departament_id: '11111111',
    })).rejects.toBeInstanceOf(AppError);
  });
});

describe('ListTeachers', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();

    teachersService = new TeacherService(
      fakeTeacherRepository,
      fakeDepartamentRepository
    );
  });

  it('Should be able to list teachers.', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const teacher1 = await teachersService.createTeacher({
      departament_id: departament.id,
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe'
    });

    const teacher2 = await teachersService.createTeacher({
      departament_id: departament.id,
      cpf: '123123123',
      email: 'janeDoe@mail.com',
      name: 'Jane Doe'
    });

    const teachers = await teachersService.listAllTeachers();

    expect(teachers).toEqual([teacher1, teacher2]);
  });
});