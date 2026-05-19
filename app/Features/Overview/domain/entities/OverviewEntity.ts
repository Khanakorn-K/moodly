export interface OverviewDailyMoodEntity {
  date: string;
  averageMood: number;
  totalLogs: number;
}

export interface OverviewMoodDistributionEntity {
  mood: number;
  count: number;
}

export interface OverviewMoodNoteEntity {
  id: string;
  date: string;
  mood: number;
  note: string;
  causes: string[];
  createdAt: string;
}

export interface OverviewMoodBreakdownEntity {
  mood: number;
  count: number;
}

export interface OverviewCauseSummaryEntity {
  cause: string;
  totalCount: number;
  moodBreakdown: OverviewMoodBreakdownEntity[];
}

export interface OverviewEntity {
  startDate: string;
  endDate: string;
  totalLogs: number;
  averageMood: number;
  dailyMoodAverages: OverviewDailyMoodEntity[];
  moodDistribution: OverviewMoodDistributionEntity[];
  moodNotes: OverviewMoodNoteEntity[];
  causeSummaries: OverviewCauseSummaryEntity[];
}
