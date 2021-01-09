import { classToClass } from "class-transformer";

import Subject from "../models/Subject";

import SecretariatType from "../models/enums/SecretariatType";
import SubjectType from "../models/enums/SubjectType";

const formatSubject = (subject: Subject): Subject => {

  if(subject.secretariat) {
    return classToClass(Object.assign(subject, {
      ...subject,
      subject_type: SubjectType[subject.subject_type],
      secretariat: {
        ...subject.secretariat,
        type: SecretariatType[subject.secretariat.type]
      }
    }));
  }

  return classToClass(Object.assign(subject, {
    ...subject,
    subject_type: SubjectType[subject.subject_type]
  }));
}

export default formatSubject;