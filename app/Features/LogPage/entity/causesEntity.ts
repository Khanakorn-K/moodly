import { CausesResponseModel } from "../models/causesResponseModel";

export class CausesEntity {
  id: string;
  userId: string;
  name: string;
  createdAt: string;

  constructor(entity: CausesResponseModel) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.name = entity.name;
    this.createdAt = entity.createdAt;
  }
}
