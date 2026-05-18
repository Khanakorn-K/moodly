import { OverViewEntity } from "../../domain/entities/OverViewEntity";
import { OverViewResponseModel } from "../models/OverViewResponseModel";

export const OverViewMapper = {
  toEntity(dto: OverViewResponseModel): OverViewEntity {
    return {
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalLogs: dto.totalLogs,
      averageMood: dto.averageMood,
      dailyMoodAverages: dto.dailyMoodAverages,
      moodDistribution: dto.moodDistribution,
      causeSummaries: dto.causeSummaries,
    };
  },
};
