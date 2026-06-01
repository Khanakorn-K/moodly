import type { ILogRepository } from "../repositories/ILogRepository";

export const createLogUseCases = (repository: ILogRepository) => ({
  getCauses: async () => {
    return await repository.getCauses();
  },
  addCause: async (data: { name: string }) => {
    if (!data.name.trim()) {
      throw new Error("กรุณาระบุชื่อสาเหตุ");
    }

    if (data.name.length > 50) {
      throw new Error("สาเหตุยาวเกินที่ระบบต้องการ 50 ตัวอักษร");
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
    createdAt: Date;
  }) => {
    if (data.selectedMood === null || !data.selectedCause)
      throw new Error("กรุณาเลือกอารมณ์และสาเหตุให้ครบถ้วน");

    if (data.note.length > 500)
      throw new Error("บันทึกไม่ควรยาวเกิน 500 ตัวอักษร");

    if (!data.createdAt) throw new Error("กรุณาเลือกวันที่");

    const createdAtTimestamp = data.createdAt.getTime();

    if (Number.isNaN(createdAtTimestamp)) {
      throw new Error("รูปแบบวันที่ไม่ถูกต้อง");
    }

    if (createdAtTimestamp > Date.now()) {
      throw new Error("ไม่สามารถเลือกวันที่ที่มากกว่าปัจจุบันได้");
    }

    await repository.addMoodLog({
      selectedMood: data.selectedMood,
      selectedCauses: [data.selectedCause],
      note: data.note,
      createdAt: data.createdAt,
    });
  },
});

export type LogUseCases = ReturnType<typeof createLogUseCases>;
