export interface MoodDistributionEntity {
  [key: string]: number;
}

export interface CausesAnalysisEntity {
  [cause: string]: {
    [mood: string]: number;
  };
}

export interface LandingEntity {
  totalLogs: number;
  moodDistribution: MoodDistributionEntity;
  causesAnalysis: CausesAnalysisEntity;
  averageMood: number;
}
