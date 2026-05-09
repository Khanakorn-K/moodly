export interface InsightsModel {
  totalLogs: number;
  moodDistribution: MoodDistributionModel;
  causesAnalysis: CausesAnalysisModel;
}

interface MoodDistributionModel {
  [key: string]: number;
}
interface CausesAnalysisModel {
  [cause: string]: {
    [mood: string]: number;
  };
}
