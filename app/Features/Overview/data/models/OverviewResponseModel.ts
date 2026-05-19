export interface OverviewDailyMoodResponseModel {
  date: string;
  averageMood: number;
  totalLogs: number;
}

export interface OverviewMoodDistributionResponseModel {
  mood: number;
  count: number;
}

export interface OverviewMoodNoteResponseModel {
  id: string;
  date: string;
  mood: number;
  note: string;
  causes: string[];
  createdAt: string;
}

export interface OverviewMoodBreakdownResponseModel {
  mood: number;
  count: number;
}

export interface OverviewCauseSummaryResponseModel {
  cause: string;
  totalCount: number;
  moodBreakdown: OverviewMoodBreakdownResponseModel[];
}

export interface OverviewResponseModel {
  startDate: string;
  endDate: string;
  totalLogs: number;
  averageMood: number;
  dailyMoodAverages: OverviewDailyMoodResponseModel[];
  moodDistribution: OverviewMoodDistributionResponseModel[];
  moodNotes: OverviewMoodNoteResponseModel[];
  causeSummaries: OverviewCauseSummaryResponseModel[];
}
