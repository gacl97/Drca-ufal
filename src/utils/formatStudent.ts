import { classToClass } from "class-transformer";

import Student from "../models/Student";

import SecretariatType from "../models/enums/SecretariatType";
import StudyShiftType from "../models/enums/StudyShiftType";

const formatStudent = (student: Student): Student => {

  if(!student.secretariat) {
    return classToClass(Object.assign(student, {
      ...student,
      study_shift: StudyShiftType[student.study_shift]
    }));
  }

  return classToClass(Object.assign(student, {
    ...student,
    study_shift: StudyShiftType[student.study_shift],
    secretariat: {
      ...student.secretariat,
      type: SecretariatType[student.secretariat.type]
    }
  }));
}

export default formatStudent;