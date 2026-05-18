import type { CauseEntity } from "../../domain/entities/CauseEntity";
import type { MoodLogPageEntity } from "../../domain/entities/MoodLogEntity";
import type { IInsightRepository } from "../../domain/repositories/IInsightRepository";
import { InsightApiDataSource } from "../dataSources/InsightApiDataSource";
import { CauseMapper } from "../mappers/CauseMapper";
import { MoodLogMapper } from "../mappers/MoodLogMapper";

export const InsightRepositoryImp: IInsightRepository = {
  getMoodLogs: async (data: {
    page: number;
    limit: number;
    mood?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MoodLogPageEntity> => {
    const response = await InsightApiDataSource.getMoodLogs(data);
    return MoodLogMapper.toPageEntity(response);
  },

  getCauses: async (): Promise<CauseEntity[]> => {
    const response = await InsightApiDataSource.getCauses();
    return response.map((item) => CauseMapper.toEntity(item));
  },

  updateMoodLog: async (
    id: string,
    data: {
      mood: number;
      note: string;
      causes: string[];
    },
  ): Promise<void> => {
    await InsightApiDataSource.updateMoodLog(id, data);
  },

  deleteMoodLog: async (id: string): Promise<void> => {
    await InsightApiDataSource.deleteMoodLog(id);
  },
};
