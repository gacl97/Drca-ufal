import AppError from "../errors/AppError";

import FakeDepartamentRepository from "../repositories/fakesRepositories/FakeDepartamentRepository";
import FakeStudentRepository from "../repositories/fakesRepositories/FakeStudentRepository";
import FakeSecretariatRepository from "../repositories/fakesRepositories/FakeSecretariatRepository";
import StudentsService from "./StudentsService";


let fakeSecretariatRepository: FakeSecretariatRepository;
let fakeDepartamentRepository: FakeDepartamentRepository;
let fakeStudentRepository: FakeStudentRepository;
let studentsService: StudentsService;

describe('CreateStudents', () => {
  beforeEach(() => {
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();
    fakeStudentRepository = new FakeStudentRepository();

    studentsService = new StudentsService(
      fakeStudentRepository,
      fakeDepartamentRepository,
      fakeSecretariatRepository
    );
  });

  it('Should be able to create a new student', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: departament.id,
      type: 0
    });

    const student = await studentsService.createStudent({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0
    });

    expect(student).toHaveProperty('id');
  });

  it('Should not be able to create a new student for a secretariat that does not exist', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    expect(studentsService.createStudent({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      secretariat_id: '1111111',
      departament_id: departament.id,
      study_shift: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new student with the same cpf from another student', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: departament.id,
      type: 0
    });

    await fakeStudentRepository.create({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0,
      current_credits: 0,
      matriculation: '1111'
    });

    expect(studentsService.createStudent({
      cpf: '111111111',
      email: 'johnDoe2@mail.com',
      name: 'John Doe Segundo',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new student with the same email from another student', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: departament.id,
      type: 0
    });

    await fakeStudentRepository.create({
      cpf: '111111123211',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0,
      current_credits: 0,
      matriculation: '1111'
    });

    expect(studentsService.createStudent({
      cpf: '1111111323211',
      email: 'johnDoe@mail.com',
      name: 'John Doe Segundo',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new student for a department that does not exist', async () => {

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '111',
      type: 0
    });
    
    expect(studentsService.createStudent({
      cpf: '111111111',
      email: 'johnDoe2@mail.com',
      name: 'John Doe Segundo',
      secretariat_id: secretariat.id,
      departament_id: '11111111',
      study_shift: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new student with a invalid study shift type.', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    expect(studentsService.createStudent({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      secretariat_id: '1111111',
      departament_id: departament.id,
      study_shift: 9
    })).rejects.toBeInstanceOf(AppError);
  });
});

describe('ListStudents', () => {
  beforeEach(() => {
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();
    fakeStudentRepository = new FakeStudentRepository();

    studentsService = new StudentsService(
      fakeStudentRepository,
      fakeDepartamentRepository,
      fakeSecretariatRepository
    );
  });

  it('Should be able to list students.', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: departament.id,
      type: 0
    });

    const student = await studentsService.createStudent({
      cpf: '111111111',
      email: 'johnDoe@mail.com',
      name: 'John Doe',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0
    });

    const student2 = await studentsService.createStudent({
      cpf: '222323132131',
      email: 'janeDoe@mail.com',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      departament_id: departament.id,
      study_shift: 0
    });

    const students = await studentsService.listAllStudents();

    expect(students).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: student.id
        }),
        expect.objectContaining({
          id: student2.id
        }),
      ]),
    );
  });
});