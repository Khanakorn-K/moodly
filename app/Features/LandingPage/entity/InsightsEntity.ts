import { InsightsModel } from "../models/InsightsModel";

export class InsightsEntity {
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
interface CausesAnalysisEntity {
  [cause: string]: {
    [mood: string]: number;
  };
}
