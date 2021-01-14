import AppError from "../errors/AppError";

import FakeStudentRepository from "../repositories/fakesRepositories/FakeStudentRepository";
import FakeTeacherRepository from "../repositories/fakesRepositories/FakeTeacherRepository";
import FakeSubjectRepository from "../repositories/fakesRepositories/FakeSubjectRepository";
import FakeSecretariatRepository from "../repositories/fakesRepositories/FakeSecretariatRepository";
import FakeStudentToSubjectRepository from "../repositories/fakesRepositories/FakeStudentToSubjectRepository";
import MatriculationsService from "./MatriculationsService";
import FakeDepartamentRepository from "../repositories/fakesRepositories/FakeDepartamentRepository";

let fakeStudentRepository: FakeStudentRepository;
let fakeDepartamentRepository: FakeDepartamentRepository;
let fakeTeacherRepository: FakeTeacherRepository;
let fakeSubjectRepository: FakeSubjectRepository;
let fakeSecretariatRepository: FakeSecretariatRepository;
let fakeStudentToSubjectRepository: FakeStudentToSubjectRepository;
let matriculationsService: MatriculationsService;

describe('CreateMatriculation', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeStudentRepository = new FakeStudentRepository();
    fakeSubjectRepository = new FakeSubjectRepository();
    fakeStudentToSubjectRepository = new FakeStudentToSubjectRepository();
    fakeSecretariatRepository = new FakeSecretariatRepository();

    matriculationsService = new MatriculationsService(
      fakeTeacherRepository,
      fakeSubjectRepository,
      fakeStudentRepository,
      fakeStudentToSubjectRepository
    );
  });

  it('Should be able to do a new matriculation', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [subject2],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    await fakeStudentToSubjectRepository.create({
      concept: 0,
      student,
      subject: subject2
    });

    const matriculation = await matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    });

    expect(matriculation.student).toHaveProperty('id'); 
    expect(matriculation.subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: subject.id
        }),
      ]),
    );
  });

  it('Should be able to do a new matriculation if a student did not matriculated or did not pass the subject and not matriculated in prerequisite', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [subject2],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    await fakeStudentToSubjectRepository.create({
      concept: 1,
      student,
      subject: subject
    });

    const matriculation = await matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    });

    expect(matriculation.student).toHaveProperty('id'); 
    expect(matriculation.subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: subject.id
        }),
      ]),
    );
  });

  it('Should be able to a undergraduate student matriculate in gradute subject if has the mininum of 170 credits', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0,
    });

    const secretariat2 = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 1,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 170,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat2.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat2
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    const matriculation = await matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    });

    expect(matriculation.student).toHaveProperty('id');
    expect(matriculation.subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: subject.id
        }),
      ]),
    );
  });

  it('Should not be able to do a matriculation with a invalid student', async () => {
    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '12321313',
      subject_type: 0,
      teacher_id: '12112121'
    });

    expect(matriculationsService.createMatriculation({
      student_id: '1231313312',
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a matriculation with a invalid subject', async () => {
    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '112121',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: '2131313',
      study_shift: 0
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects: [{
        id: '1231321',
        name: 'materia 1'
        }
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to do a matriculation with student departament is different from subject departament', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '1232131',
      type: 0,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '1233445',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to do a matriculation if the student does not have the minimum credits to take the course',async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 30,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 60,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Undergraduate students should not be able to matriculated in graduate courses without a minimum of 170 credits', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0,
    });

    const secretariat2 = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 1,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat2.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat2
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Graduate student should not be able to matriculated in undergraduate subjects', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0,
    });

    const secretariat2 = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 1,
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat2.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat2
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to matriculate in subjects that have already been approved or matriculated.', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 80,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '3123',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 2',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(subject2, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    await fakeStudentToSubjectRepository.create({
      concept: 3,
      student,
      subject
    });

    await fakeStudentToSubjectRepository.create({
      concept: 0,
      student,
      subject: subject2
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to matriculate if do not have the minimum credits to enroll in the prerequisite', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 10,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '3123',
      credits: 90,
      minimum_credits: 80,
      name: 'Materia 2',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [subject2],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to matriculate that have not been approved or matriculated in the prerequisites.', async () => {
    const secretariat = await fakeSecretariatRepository.create({
      departament_id: '12321',
      type: 0
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 10,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject2 = await fakeSubjectRepository.create({
      code: '3123',
      credits: 90,
      minimum_credits: 0,
      name: 'Materia 2',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [subject2],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: '12112121'
    });

    Object.assign(subject, {
      secretariat: secretariat
    });

    Object.assign(student, {
      secretariat: secretariat
    });

    await fakeStudentToSubjectRepository.create({
      concept: 1,
      student,
      subject: subject2
    })
    
    expect(matriculationsService.createMatriculation({
      student_id: student.id,
      subjects:[
        subject
      ]
    })).rejects.toBeInstanceOf(AppError);
  });
});

describe('ShowMatriculation', () => {
  beforeEach(() => {
    fakeTeacherRepository = new FakeTeacherRepository();
    fakeStudentRepository = new FakeStudentRepository();
    fakeSubjectRepository = new FakeSubjectRepository();
    fakeStudentToSubjectRepository = new FakeStudentToSubjectRepository();
    fakeSecretariatRepository = new FakeSecretariatRepository();
    fakeDepartamentRepository = new FakeDepartamentRepository();

    matriculationsService = new MatriculationsService(
      fakeTeacherRepository,
      fakeSubjectRepository,
      fakeStudentRepository,
      fakeStudentToSubjectRepository
    );
  });

  it('Should be able to show student matriculation', async () => {
    const departament = await fakeDepartamentRepository.create({
      name: 'Departament'
    })

    const secretariat = await fakeSecretariatRepository.create({
      departament_id: departament.id,
      type: 0
    });

    const teacher = await fakeTeacherRepository.create({
      cpf: '1231231231',
      departament_id: '324132',
      email: 'johndoe@mail.com',
      matriculation: '34242',
      name: 'John Doe'
    });

    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 10,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: secretariat.id,
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: secretariat.id,
      subject_type: 0,
      teacher_id: teacher.id
    });

    Object.assign(student, {
      secretariat: secretariat,
      departament: departament
    });


    await fakeStudentToSubjectRepository.create({
      concept: 3,
      student,
      subject: subject
    });

    const { student: studentReturned, subjects } = await matriculationsService.showMatriculation({
      student_id: student.id,
    });

    expect(studentReturned).toHaveProperty('matriculation');
    expect(subjects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: subject.name
        }),
      ]),
    );
  });

  it('Should not be able to show student matriculation with a invalid student', async () => {
    expect(matriculationsService.showMatriculation({
      student_id: '13123413'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to show student matriculation with a subject with an invalid teacher', async () => {
    const student = await fakeStudentRepository.create({
      cpf: '2123121313',
      current_credits: 10,
      departament_id: '12321',
      email: 'janeDoe@mail.com',
      matriculation: '1232131321',
      name: 'Jane Doe',
      secretariat_id: '132123',
      study_shift: 0
    });

    const subject = await fakeSubjectRepository.create({
      code: '21313',
      credits: 30,
      minimum_credits: 0,
      name: 'Materia 1',
      pre_requisits: [],
      secretariat_id: '132123',
      subject_type: 0,
      teacher_id: '12312321'
    });

    await fakeStudentToSubjectRepository.create({
      concept: 3,
      student,
      subject: subject
    });

    expect(matriculationsService.showMatriculation({
      student_id: student.id
    })).rejects.toBeInstanceOf(AppError);
  });
});