import { CausesEntity } from "../entity/causesEntity";
import { IInsightRepository } from "../repositories/IInsightRepository";

export const InsightUseCase = (repository: IInsightRepository) => ({
  getMoods: async (
    page: number,
    limit: number,
    mood: string,
    startDate: string,
    endDate: string,
  ) => {
    return await repository.getMoods(page, limit, mood, startDate, endDate);
  },
  getMyCauses: async (): Promise<CausesEntity[]> => {
    return await repository.getMyCauses();
  },
  updateMood: async (
    id: string,
    mood: number,
    note: string,
    causes: string[],
  ) => {
    return await repository.updateMood(id, { mood, note, causes });
  },
  deleteMood: async (id: string) => {
    return await repository.deleteMood(id);
  },
});
