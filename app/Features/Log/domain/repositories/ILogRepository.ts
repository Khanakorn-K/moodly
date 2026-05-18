import type { CauseEntity } from "@/app/shared/entities/CauseEntity";

export interface ILogRepository {
  addMoodLog: (data: {
    selectedMood: number;
    selectedCauses: string[];
    note: string;
  }) => Promise<void>;
  addCause: (data: { name: string }) => Promise<void>;
  updateCause: (data: { id: string; name: string }) => Promise<void>;
  getCauses: () => Promise<CauseEntity[]>;
  deleteCause: (data: { id: string }) => Promise<void>;
}
