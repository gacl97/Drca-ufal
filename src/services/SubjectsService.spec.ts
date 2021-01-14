import AppError from "../errors/AppError";

import FakeSecretariatRepository from "../repositories/fakesRepositories/FakeSecretariatRepository";
import FakeTeacherRepository from "../repositories/fakesRepositories/FakeTeacherRepository";
import FakeSubjectRepository from "../repositories/fakesRepositories/FakeSubjectRepository";
import FakeStudentToSubjectRepository from "../repositories/fakesRepositories/FakeStudentToSubjectRepository";
import SubjectsService from "./SubjectsService";
import FakeStudentRepository from "../repositories/fakesRepositories/FakeStudentRepository";


let fakeSecretariatRepository: FakeSecretariatRepository;
let fakeStudentRepository: FakeStudentRepository;
let fakeTeacherRepository: FakeTeacherRepository;
let fakeSubjectRepository: FakeSubjectRepository;
let fakeStudentToSubjectRepository: FakeStudentToSubjectRepository;
let subjectsService: SubjectsService;

describe('CreateSubjects', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeSubjectRepository = new FakeSubjectRepository();
    fakeStudentToSubjectRepository = new FakeStudentToSubjectRepository();
    fakeStudentRepository = new FakeStudentRepository();

    subjectsService = new SubjectsService(
      fakeTeacherRepository,
      fakeSecretariatRepository,
      fakeSubjectRepository,
      fakeStudentToSubjectRepository
    );
  });

  it('Should be able to create a new subject', async () => {
    const teacher = await fakeTeacherRepository.create({
      cpf: '1111',
      departament_id: '11111111',
      email: 'JohnDoe@mail.com',
      matriculation: '11231',
      name: 'John Doe'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '121212',
      type: 0
    });

    const subject = await subjectsService.createSubject({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 0
    });

    expect(subject).toHaveProperty('id');
  });

  it('Should not be able to create a subject with grades less than 0', async () => {

    expect(subjectsService.createSubject({
      code: '1231321',
      credits: -29,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '22212121',
      teacher_id: '112212123',
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a subject with grades greater than 120', async () => {

    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 1289,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '22212121',
      teacher_id: '112212123',
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a subject with a invalid subject type', () => {
    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 20,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '22212121',
      teacher_id: '112212123',
      subject_type: 12
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a subject with a minimum credits less than 0', () => {
    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 20,
      minimum_credits: -12,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '22212121',
      teacher_id: '112212123',
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a subject with the same code to another subject', async () => {
    await fakeSubjectRepository.create({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '111111111',
      teacher_id: '122123123',
      subject_type: 0
    });


    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 20,
      minimum_credits: 20,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '22212121',
      teacher_id: '112212123',
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new subject with a invalid teacher', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '121212',
      type: 0
    });

    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 20,
      minimum_credits: 20,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      teacher_id: '112212123',
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new subject with a invalid secretariat', async () => {
    const teacher = await fakeTeacherRepository.create({
      cpf: '1111',
      departament_id: '11111111',
      email: 'JohnDoe@mail.com',
      matriculation: '11231',
      name: 'John Doe'
    });

    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 20,
      minimum_credits: 20,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '12313213',
      teacher_id: teacher.id,
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new subject with pre requisits invalids', async () => {
    const teacher = await fakeTeacherRepository.create({
      cpf: '1111',
      departament_id: '11111111',
      email: 'JohnDoe@mail.com',
      matriculation: '11231',
      name: 'John Doe'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '121212',
      type: 0
    });

    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [{
        id: '123123',
        name: 'Materia 2'
      }],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new subject that is required and has an elective prerequisite', async () => {
    const teacher = await fakeTeacherRepository.create({
      cpf: '1111',
      departament_id: '11111111',
      email: 'JohnDoe@mail.com',
      matriculation: '11231',
      name: 'John Doe'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '121212',
      type: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '122131',
      credits: 60,
      minimum_credits: 0,
      name: 'Materia 5',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 1
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '123',
      credits: 60,
      minimum_credits: 0,
      name: 'Materia 6',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 0
    });

    expect(subjectsService.createSubject({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [
        {
          id: subject.id,
          name: 'Materia 5'
        },
        {
          id: subject2.id,
          name: 'Materia 6'
      }],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 0
    })).rejects.toBeInstanceOf(AppError);
  });
});

describe('ListSubjects', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeSubjectRepository = new FakeSubjectRepository();
    fakeStudentToSubjectRepository = new FakeStudentToSubjectRepository();

    subjectsService = new SubjectsService(
      fakeTeacherRepository,
      fakeSecretariatRepository,
      fakeSubjectRepository,
      fakeStudentToSubjectRepository
    );
  });

  it('Should be able to list subjects.', async () => {
    const teacher = await fakeTeacherRepository.create({
      cpf: '1111',
      departament_id: '11111111',
      email: 'JohnDoe@mail.com',
      matriculation: '11231',
      name: 'John Doe'
    });

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '121212',
      type: 0
    });

    const subject1 = await subjectsService.createSubject({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 0
    });

    const subject2 = await subjectsService.createSubject({
      code: '12354657',
      credits: 60,
      minimum_credits: 30,
      name: 'Materia 2',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      teacher_id: teacher.id,
      subject_type: 0
    });

    const subjects = await subjectsService.listAllSubjects();
    
    expect(subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: subject1.id
        }),
        expect.objectContaining({
          id: subject2.id
        })
      ]),
    );
  });
});

describe('ShowOneSubject', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeSubjectRepository = new FakeSubjectRepository();
    fakeStudentToSubjectRepository = new FakeStudentToSubjectRepository();

    subjectsService = new SubjectsService(
      fakeTeacherRepository,
      fakeSecretariatRepository,
      fakeSubjectRepository,
      fakeStudentToSubjectRepository
    );
  });

  it('Should be able to show one subject.', async () => {
    const subject1 = await fakeSubjectRepository.create({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '1231',
      teacher_id: '121212',
      subject_type: 0
    });

    const { subject } = await subjectsService.showSubject({
      subject_id: subject1.id
    });

    expect(subject).toHaveProperty('id');
  });

  it('Should be able to list subjects that are not currently subscribed.', async () => {
    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 170,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: '21313213',
      study_shift: 0
    });

    const subject1 = await fakeSubjectRepository.create({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '1231',
      teacher_id: '121212',
      subject_type: 0
    });

    await fakeStudentToSubjectRepository.create({
      concept: 1,
      student,
      subject: subject1
    });

    const { subject, matriculated_students } = await subjectsService.showSubject({
      subject_id: subject1.id
    });

    expect(subject).toHaveProperty('id');
    expect(matriculated_students).toEqual([]);
  });

  it('Should not be able to show a invalid subject.', async () => {
    
    expect(subjectsService.showSubject({
      subject_id: '12321312'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to show a list of matriculated students.', async () => {
    const subject = await fakeSubjectRepository.create({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '1231',
      teacher_id: '121212',
      subject_type: 0
    });
    
    const student = await fakeStudentRepository.create({
      cpf: '1111111323211',
      email: 'johnDoe@mail.com',
      name: 'John Doe Segundo',
      secretariat_id: '12313',
      departament_id: '21334',
      study_shift: 0,
      current_credits: 60,
      matriculation: '1231232543'
    })

    await fakeStudentToSubjectRepository.create({
      student,
      concept: 3,
      subject
    });

    const { matriculated_students } = await subjectsService.showSubject({
      subject_id: subject.id
    })

    expect(matriculated_students).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: student.id
        }),
      ]),
    );
  });
});