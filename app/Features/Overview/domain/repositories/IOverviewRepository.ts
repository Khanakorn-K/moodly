import {
  MonthlyAverageMoodEntity,
  OverviewEntity,
} from "../entities/OverviewEntity";

export interface IOverviewRepository {
  getOverview: (data: {
    startDate: string;
    endDate: string;
  }) => Promise<OverviewEntity>;

  getMonthlyAverageMood: (data: {
    month: string;
  }) => Promise<MonthlyAverageMoodEntity>;
}
