import { ILogRepository } from "../repositories/ILogRepository";

export const getLogUseCase = (repository: ILogRepository) => ({
  getMyCausesUseCase: async () => {
    return await repository.fetchGetMyCauses();
  },
  addCauseUseCase: async (name: string) => {
    if (!name.trim()) {
      throw new Error("กรุณาระบุชื่อสาเหตุ");
    }
    return await repository.fetchAddCauses(name);
  },
  deleteCauseUseCase: async (id: string) => {
    return await repository.fetchDeleteMyCauses(id);
  },
  addMoodLogUseCase: async (
    selectedMood: number | null,
    selectedCause: string | null,
    note: string,
  ) => {
    if (!selectedMood || !selectedCause) {
      throw new Error("กรุณาเลือกอารมณ์และสาเหตุให้ครบถ้วน");
    }
    return await repository.fetchAddMood(selectedMood, [selectedCause], note);
  },
});
