export interface OverViewDailyMoodEntity {
  date: string;
  averageMood: number;
  totalLogs: number;
}

export interface OverViewMoodDistributionEntity {
  mood: number;
  count: number;
}

export interface OverViewMoodNoteEntity {
  id: string;
  date: string;
  mood: number;
  note: string;
  causes: string[];
  createdAt: string;
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
  moodNotes: OverViewMoodNoteEntity[];
  causeSummaries: OverViewCauseSummaryEntity[];
}
