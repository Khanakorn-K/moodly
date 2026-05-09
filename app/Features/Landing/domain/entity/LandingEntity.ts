import { InsightsModel } from "../../services/models/InsightsModel";

export class LandingEntity {
  totalLogs: number;
  moodDistribution: MoodDistributionEntity;
  causesAnalysis: CausesAnalysisEntity;
  constructor(entity: InsightsModel) {
    this.totalLogs = entity.totalLogs;
    this.moodDistribution = entity.moodDistribution;
    this.causesAnalysis = entity.causesAnalysis;
  }
}

interface MoodDistributionEntity {
  [key: string]: number;
}
export interface CausesAnalysisEntity {
  [cause: string]: {
    [mood: string]: number;
  };
}
