import { CausesEntity } from "../../domain/entity/causesEntity";
import { CausesResponseModel } from "../models/causesResponseModel";

export const causesMapper = {
  toEntity: (dto: CausesResponseModel): CausesEntity => {
    return {
      id: dto.id,
      userId: dto.userId,
      name: dto.name,
      createdAt: dto.createdAt,
    };
  },
};
