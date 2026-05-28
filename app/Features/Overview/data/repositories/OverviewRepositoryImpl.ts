import {
  MonthlyAverageMoodEntity,
  OverviewEntity,
} from "../../domain/entities/OverviewEntity";
import { IOverviewRepository } from "../../domain/repositories/IOverviewRepository";
import { OverviewApiDataSource } from "../dataSources/OverviewApiDataSource";
import { MonthlyAverageMoodMapper } from "../mappers/monthlyAverageMoodMapper";
import { OverviewMapper } from "../mappers/overviewMapper";

// Data layer เท่านั้น: เรียก dataSource และ map DTO -> domain entity.
// ห้ามใส่ UI state หรือ business validation ใน repository นี้.
export const OverviewRepositoryImpl: IOverviewRepository = {
  getOverview: async function (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverviewEntity> {
    const response = await OverviewApiDataSource.getOverview(data);
    return OverviewMapper.toEntity(response);
  },

  getMonthlyAverageMood: async function (data: {
    month: string;
  }): Promise<MonthlyAverageMoodEntity> {
    const response = await OverviewApiDataSource.getMonthlyAverageMood(data);
    return MonthlyAverageMoodMapper.toEntity(response);
  },
};
