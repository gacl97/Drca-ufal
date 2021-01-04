import ConceptSubjectType from "../models/enums/ConceptSubjectType";
import Student from "../models/Student";
import Subject from "../models/Subject";

export default interface ICreateStudentToSubjectDTO {
  student: Student;
  subject: Subject;
  concept: ConceptSubjectType;
}