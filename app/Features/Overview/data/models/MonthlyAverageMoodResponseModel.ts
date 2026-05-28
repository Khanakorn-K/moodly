import { OverviewDailyMoodResponseModel } from "./OverviewResponseModel";

export interface MonthlyAverageMoodResponseModel {
  month: string;
  startDate: string;
  endDate: string;
  totalLogs: number;
  averageMood: number;
  dailyMoodAverages: OverviewDailyMoodResponseModel[];
}
