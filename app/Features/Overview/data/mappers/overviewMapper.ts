import { OverviewEntity } from "../../domain/entities/OverviewEntity";
import { OverviewResponseModel } from "../models/OverviewResponseModel";

export const OverviewMapper = {
  toEntity(dto: OverviewResponseModel): OverviewEntity {
    return {
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalLogs: dto.totalLogs,
      averageMood: dto.averageMood,
      dailyMoodAverages: dto.dailyMoodAverages,
      moodDistribution: dto.moodDistribution,
      moodNotes: dto.moodNotes,
      causeSummaries: dto.causeSummaries,
    };
  },
};
