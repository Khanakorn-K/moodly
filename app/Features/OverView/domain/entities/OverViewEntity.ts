export interface OverViewDailyMoodEntity {
  date: string;
  averageMood: number;
  totalLogs: number;
}

export interface OverViewMoodDistributionEntity {
  mood: number;
  count: number;
}

export interface OverViewMoodBreakdownEntity {
  mood: number;
  count: number;
}

export interface OverViewCauseSummaryEntity {
  cause: string;
  totalCount: number;
  moodBreakdown: OverViewMoodBreakdownEntity[];
}

export interface OverViewEntity {
  startDate: string;
  endDate: string;
  totalLogs: number;
  averageMood: number;
  dailyMoodAverages: OverViewDailyMoodEntity[];
  moodDistribution: OverViewMoodDistributionEntity[];
  causeSummaries: OverViewCauseSummaryEntity[];
}
