import type {
  MoodLogEntity,
  MoodLogPageEntity,
} from "../../domain/entities/MoodLogEntity";
import type {
  MoodLogResponseModel,
  MoodLogsResponseModel,
} from "../models/MoodLogsResponseModel";

export const MoodLogMapper = {
  toEntity: (dto: MoodLogResponseModel): MoodLogEntity => {
    return {
      id: dto.id,
      userId: dto.userId,
      mood: Number(dto.mood),
      note: dto.note ?? "",
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      causes: dto.causes ?? [],
    };
  },

  toPageEntity: (dto: MoodLogsResponseModel): MoodLogPageEntity => {
    return {
      items: dto.data.map((item) => MoodLogMapper.toEntity(item)),
      total: dto.total,
      page: dto.page,
    };
  },
};
