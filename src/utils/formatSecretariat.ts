import SecretariatType from "../models/enums/SecretariatType";
import Secretariat from "../models/Secretariat";

const formatSecretariat = (secretariat: Secretariat): Secretariat => {

  return Object.assign(secretariat, {
    ...secretariat,
    type: SecretariatType[secretariat.type]
  })
}

export default formatSecretariat;