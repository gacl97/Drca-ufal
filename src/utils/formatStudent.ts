import SecretariatType from "../models/enums/SecretariatType";
import StudyShiftType from "../models/enums/StudyShiftType";
import Student from "../models/Student";


const formatStudent = (student: Student): Student => {

  if(!student.secretariat) {
    return Object.assign(student, {
      ...student,
      study_shift: StudyShiftType[student.study_shift]
      
    });
  }

  return Object.assign(student, {
    ...student,
    study_shift: StudyShiftType[student.study_shift],
    secretariat: {
      ...student.secretariat,
      type: SecretariatType[student.secretariat.type]
    }
  });
}

export default formatStudent;