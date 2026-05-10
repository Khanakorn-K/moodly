import { CausesEntity } from "../../domain/entity/causesEntity";
import { InsightEntity } from "../../domain/entity/InsightEntity";
import { IInsightRepository } from "../../domain/repositories/IInsightRepository";
import InsightApiDataSource from "../dataSource/InsightApiDataSource";
import { causesMapper } from "../mappers/causesMapper";
import { InsightMapper } from "../mappers/InsightMapper";

export const InsightRepositoryImpl: IInsightRepository = {
  getMoods: async (
    page: number,
    limit: number,
    mood: string,
    startDate: string,
    endDate: string,
  ): Promise<InsightEntity> => {
    const response = await InsightApiDataSource.getMoods(
      page,
      limit,
      mood,
      startDate,
      endDate,
    );
    return InsightMapper.toEntity(response);
  },
  getMyCauses: async (): Promise<CausesEntity[]> => {
    const response = await InsightApiDataSource.getMyCauses();
    return response.map((item) => causesMapper.toEntity(item));
  },
  updateMood: async (id: string, data: any): Promise<void> => {
    await InsightApiDataSource.updateMood(id, data);
  },

  deleteMood: async (id: string): Promise<void> => {
    await InsightApiDataSource.deleteMood(id);
  },
};
