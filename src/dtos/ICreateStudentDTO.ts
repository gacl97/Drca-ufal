import StudyShiftType from "../models/enums/StudyShiftType";

export default interface ICreateStudentDTO {
  name: string;
  email: string;
  cpf: string;
  matriculation: string;
  departament_id: string;
  secretariat_id: string;
  study_shift: StudyShiftType;
  current_credits: number;
}