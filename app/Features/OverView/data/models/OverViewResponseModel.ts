export interface OverViewDailyMoodResponseModel {
  date: string;
  averageMood: number;
  totalLogs: number;
}

export interface OverViewMoodDistributionResponseModel {
  mood: number;
  count: number;
}

export interface OverViewMoodNoteResponseModel {
  id: string;
  date: string;
  mood: number;
  note: string;
  causes: string[];
  createdAt: string;
}

export interface OverViewMoodBreakdownResponseModel {
  mood: number;
  count: number;
}

export interface OverViewCauseSummaryResponseModel {
  cause: string;
  totalCount: number;
  moodBreakdown: OverViewMoodBreakdownResponseModel[];
}

export interface OverViewResponseModel {
  startDate: string;
  endDate: string;
  totalLogs: number;
  averageMood: number;
  dailyMoodAverages: OverViewDailyMoodResponseModel[];
  moodDistribution: OverViewMoodDistributionResponseModel[];
  moodNotes: OverViewMoodNoteResponseModel[];
  causeSummaries: OverViewCauseSummaryResponseModel[];
}
