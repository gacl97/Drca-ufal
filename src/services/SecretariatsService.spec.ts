import FakeDepartamentRepository from "../repositories/fakesRepositories/FakeDepartamentRepository";
import FakeSubjectRepository from "../repositories/fakesRepositories/FakeSubjectRepository";
import FakeSecretariatRepository from "../repositories/fakesRepositories/FakeSecretariatRepository";
import SecretariatsService from "./SecretariatsService";
import AppError from "../errors/AppError";


let fakeSecretariatRepository: FakeSecretariatRepository;
let fakeDepartamentRepository: FakeDepartamentRepository;
let fakeSubjectRepository: FakeSubjectRepository;
let secretariatService: SecretariatsService;

describe('CreateSecretariats', () => {
  beforeEach(() => {
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();
    fakeSubjectRepository = new FakeSubjectRepository();

    secretariatService = new SecretariatsService(
      fakeSecretariatRepository,
      fakeDepartamentRepository,
      fakeSubjectRepository
    );
  });

  it('Should be able to create a new secretariat', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const secretariat = await secretariatService.createSecretariat({
      type: 0,
      departament_id: departament.id
    });

    expect(secretariat).toHaveProperty('id');
  });

  it('Should not be able to create a new secretariat for a department that does not exist', async () => {
    
    expect(secretariatService.createSecretariat({
      type: 0,
      departament_id: '2123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new secretariat with the same type of another in the same departament', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    await fakeSecretariatRepository.create({
      departament_id: departament.id,
      type: 0
    });

    expect(secretariatService.createSecretariat({
      departament_id: departament.id,
      type: 0,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new secretariat with a invalid type.', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    expect(secretariatService.createSecretariat({
      departament_id: departament.id,
      type: 9,
    })).rejects.toBeInstanceOf(AppError);
  });
});

describe('ListSecretariats', () => {
  beforeEach(() => {
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();
    fakeSubjectRepository = new FakeSubjectRepository();

    secretariatService = new SecretariatsService(
      fakeSecretariatRepository,
      fakeDepartamentRepository,
      fakeSubjectRepository
    );
  });

  it('Should be able to list secretariats.', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Instituto de computação'
    });

    const secretariat1 = await secretariatService.createSecretariat({
      departament_id: departament.id,
      type: 0
    });

    const secretariat2 = await secretariatService.createSecretariat({
      departament_id: departament.id,
      type: 1
    });

    const subject1 = await fakeSubjectRepository.create({
      code: '1231321',
      credits: 40,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat1.id,
      teacher_id: '12351324',
      subject_type: 0
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '12354657',
      credits: 60,
      minimum_credits: 30,
      name: 'Materia 2',
      pre_requisits: [],
      secretariat_id: secretariat2.id,
      teacher_id: '112123213',
      subject_type: 0
    });


    const secretariats = await secretariatService.listAllSecretariats();
    
    expect(secretariats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          secretariat: expect.objectContaining({
            id: secretariat1.id,
          }),
          subjects: expect.arrayContaining([
            expect.objectContaining({
              id: subject1.id
            })
          ])
        }),
        expect.objectContaining({
          secretariat: expect.objectContaining({
            id: secretariat2.id,
          }),
          subjects: expect.arrayContaining([
            expect.objectContaining({
              id: subject2.id
            })
          ])
        }),
      ]),
    );
  });
});