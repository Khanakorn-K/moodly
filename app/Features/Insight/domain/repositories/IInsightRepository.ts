import { CausesEntity } from "@/app/share/entities/causesEntity";
import { InsightEntity } from "../entity/InsightEntity";

export interface IInsightRepository {
  getMoods: (
    page: number,
    limit: number,
    mood: string,
    startDate: string,
    endDate: string,
  ) => Promise<InsightEntity>;
  getMyCauses: () => Promise<CausesEntity[]>;
  updateMood: (id: string, data: any) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
}
