import type { CauseEntity } from "@/app/shared/entities/CauseEntity";
import type { MoodLogPageEntity } from "../entities/MoodLogEntity";
import type { IInsightRepository } from "../repositories/IInsightRepository";

export const createInsightUseCases = (repository: IInsightRepository) => ({
  getMoodLogs: async (
    data: {
      page: number;
      limit: number;
      mood?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<MoodLogPageEntity> => {
    return await repository.getMoodLogs(data);
  },
  getCauses: async (): Promise<CauseEntity[]> => {
    return await repository.getCauses();
  },
  updateMoodLog: async (
    id: string,
    data: {
      mood: number;
      note: string;
      causes: string[];
    },
  ) => {
    return await repository.updateMoodLog(id, data);
  },
  deleteMoodLog: async (id: string) => {
    return await repository.deleteMoodLog(id);
  },
});

export type InsightUseCases = ReturnType<typeof createInsightUseCases>;
