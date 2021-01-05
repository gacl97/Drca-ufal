import SecretariatType from "../models/enums/SecretariatType";
import SubjectType from "../models/enums/SubjectType";
import Subject from "../models/Subject";

const formatSubject = (subject: Subject): Subject => {

  if(subject.secretariat) {
    return Object.assign(subject, {
      ...subject,
      subject_type: SubjectType[subject.subject_type],
      secretariat: {
        ...subject.secretariat,
        type: SecretariatType[subject.secretariat.type]
      }
    });
  }

  return Object.assign(subject, {
    ...subject,
    subject_type: SubjectType[subject.subject_type]
  });
}

export default formatSubject;