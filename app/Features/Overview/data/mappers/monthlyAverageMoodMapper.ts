import { MonthlyAverageMoodEntity } from "../../domain/entities/OverviewEntity";
import { MonthlyAverageMoodResponseModel } from "../models/MonthlyAverageMoodResponseModel";
export const MonthlyAverageMoodMapper = {
  toEntity(dto: MonthlyAverageMoodResponseModel): MonthlyAverageMoodEntity {
    return {
      month: dto.month,
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalLogs: dto.totalLogs,
      averageMood: dto.averageMood,
      dailyMoodAverages: dto.dailyMoodAverages,
    };
  },
};
