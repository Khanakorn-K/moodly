import type { CauseEntity } from "../entities/CauseEntity";
import type { CauseResponseModel } from "../models/CauseResponseModel";

export const CauseMapper = {
  toEntity: (dto: CauseResponseModel): CauseEntity => {
    return {
      id: dto.id,
      userId: dto.userId,
      name: dto.name,
      createdAt: dto.createdAt,
    };
  },
};
