import SubjectType from "../models/enums/SubjectType";

export default interface ICreateSubjectDTO {
  name: string;
  code: string;
  credits: number
  minimum_credits: number;
  subject_type: SubjectType;
  teacher_id: string;
  secretariat_id: string;
}