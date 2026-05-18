import type { CauseEntity } from "../entities/CauseEntity";

export interface ILogRepository {
  addMoodLog: (data: {
    selectedMood: number;
    selectedCauses: string[];
    note: string;
  }) => Promise<void>;
  addCause: (data: { name: string }) => Promise<void>;
  getCauses: () => Promise<CauseEntity[]>;
  deleteCause: (data: { id: string }) => Promise<void>;
}
