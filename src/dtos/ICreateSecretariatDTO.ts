import SecretariatType from "../models/enums/SecretariatType";

export default interface ICreateSecretariatDTO {
  type: SecretariatType;
  departament_id: string;
}