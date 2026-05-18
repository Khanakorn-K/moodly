import type { CauseEntity } from "../entities/CauseEntity";
import type { MoodLogPageEntity } from "../entities/MoodLogEntity";

export interface IInsightRepository {
  getMoodLogs: (data: {
    page: number;
    limit: number;
    mood?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<MoodLogPageEntity>;
  getCauses: () => Promise<CauseEntity[]>;
  updateMoodLog: (
    id: string,
    data: {
      mood: number;
      note: string;
      causes: string[];
    },
  ) => Promise<void>;
  deleteMoodLog: (id: string) => Promise<void>;
}
