import type { LandingEntity } from "../../domain/entities/LandingEntity";
import type { InsightsResponseModel } from "../models/InsightsResponseModel";

export const LandingMapper = {
  toEntity: (dto: InsightsResponseModel): LandingEntity => {
    return {
      totalLogs: dto.totalLogs || 0,
      moodDistribution: dto.moodDistribution || {},
      causesAnalysis: dto.causesAnalysis || {},
      averageMood: 0,
    };
  },
};
