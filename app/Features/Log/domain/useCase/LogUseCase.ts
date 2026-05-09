import { ILogRepository } from "../repositories/ILogRepository";

export const makeLogUseCase = (repository: ILogRepository) => ({
  getMyCausesUseCase: async () => {
    return await repository.fetchGetMyCauses();
  },
  addCauseUseCase: async (name: string) => {
    return await repository.fetchAddCauses(name);
  },
  deleteCauseUseCase: async (id: string) => {
    return await repository.fetchDeleteMyCauses(id);
  },
  addMoodLogUseCase: async (
    selectedMood: number,
    selectedCauses: string[],
    note: string,
  ) => {
    return await repository.fetchAddMood(selectedMood, selectedCauses, note);
  },
});
