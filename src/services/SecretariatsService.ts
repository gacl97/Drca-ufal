import { inject, injectable } from 'tsyringe';
import AppError from '../errors/AppError';

import SecretariatType from '../models/enums/SecretariatType';
import Secretariat from '../models/Secretariat';
import Subject from '../models/Subject';

import IDeparmentRepository from '../repositories/IDepartamentRepository';
import ISecretariatRepository from '../repositories/ISecretariatRepository';
import ISubjectRepository from '../repositories/ISubjectRepository';
import formatSecretariat from '../utils/formatSecretariat';
import formatSubject from '../utils/formatSubject';

interface IRequestDTO {
  type: SecretariatType;
  departament_id: string;
}

interface IResponseListAllSecretariatsDTO {
  secretariat: Secretariat;
  subjects: Subject[];
}

@injectable()
class SecretariatsService {

  constructor(
    @inject('SecretariatRepository')
    private secretariatRepository: ISecretariatRepository,
    @inject('DepartamentRepository')
    private departamentRepository: IDeparmentRepository,
    @inject('SubjectRepository')
    private subjectRepository: ISubjectRepository
  ) {}

  public async createSecretariat({ type, departament_id }: IRequestDTO): Promise<Secretariat> {

    if(!SecretariatType[type]) {
      throw new AppError('Type of secretariat not found', 404)
    }
    
    const departamentExists = await this.departamentRepository.findById(departament_id);

    if(!departamentExists) {
      throw new AppError('Departament not found', 404);
    }

    const secreatariatExists = await this.secretariatRepository.findByType(departament_id, type);

    if(secreatariatExists) {
      throw new AppError('This secretariat already exists.');
    }

    const secretariat = await this.secretariatRepository.create({
      type,
      departament_id
    });

    Object.assign(secretariat, {
      ...secretariat,
      type: SecretariatType[secretariat.type]
    })

    return secretariat;
  }

  public async listAllSecretariats(): Promise<IResponseListAllSecretariatsDTO[]> {
    const secretariats = await this.secretariatRepository.findAll();

    const secretariatsToReturn = await Promise.all(secretariats.map(async secretariat => {
      const subjectsBySecretariat = await this.subjectRepository.findAllBySecretariat(secretariat.id);

      const subjects = subjectsBySecretariat.map(subject => {
        return formatSubject(subject);
      });

      return {
        secretariat: formatSecretariat(secretariat),
        subjects
      };
    }));

    return secretariatsToReturn;
  }
}

export default SecretariatsService;