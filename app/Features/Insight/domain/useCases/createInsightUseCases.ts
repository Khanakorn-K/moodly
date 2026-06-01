import type { CauseEntity } from "@/app/shared/entities/CauseEntity";
import type { MoodLogPageEntity } from "../entities/MoodLogEntity";
import type { IInsightRepository } from "../repositories/IInsightRepository";

export const createInsightUseCases = (repository: IInsightRepository) => ({
  getMoodLogs: async (data: {
    mood?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<MoodLogPageEntity> => {
    if (
      data.mood !== undefined &&
      (!Number.isInteger(data.mood) || data.mood < 1 || data.mood > 5)
    ) {
      throw new Error("รูปแบบอารมณ์ไม่ถูกต้อง");
    }

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
