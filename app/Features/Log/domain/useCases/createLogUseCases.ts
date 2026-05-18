import type { ILogRepository } from "../repositories/ILogRepository";

export const createLogUseCases = (repository: ILogRepository) => ({
  getCauses: async () => {
    return await repository.getCauses();
  },
  addCause: async (data: { name: string }) => {
    if (!data.name.trim()) {
      throw new Error("กรุณาระบุชื่อสาเหตุ");
    }
    return await repository.addCause(data);
  },
  updateCause: async (data: { id: string; name: string }) => {
    if (!data.id) {
      throw new Error("ไม่พบสาเหตุที่ต้องการแก้ไข");
    }
    if (!data.name.trim()) {
      throw new Error("กรุณาระบุชื่อสาเหตุ");
    }
    return await repository.updateCause({
      id: data.id,
      name: data.name.trim(),
    });
  },
  deleteCause: async (data: { id: string }) => {
    return await repository.deleteCause(data);
  },
  addMoodLog: async (data: {
    selectedMood: number | null;
    selectedCause: string | null;
    note: string;
  }) => {
    if (!data.selectedMood || !data.selectedCause) {
      throw new Error("กรุณาเลือกอารมณ์และสาเหตุให้ครบถ้วน");
    }
    return await repository.addMoodLog({
      selectedMood: data.selectedMood,
      selectedCauses: [data.selectedCause],
      note: data.note,
    });
  },
});

export type LogUseCases = ReturnType<typeof createLogUseCases>;
