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
    if (!id.trim()) {
      throw new Error("ไม่พบบันทึกอารมณ์ที่ต้องการแก้ไข");
    }
    if (data.note.length > 500) {
      throw new Error("ไม่สามารถอัปเดทให้มีมากกว่า 500 ตัวอักษรได้");
    }
    if (!Number.isInteger(data.mood) || data.mood < 1 || data.mood > 5) {
      throw new Error("กรุณาเลือกอารมณ์ให้ถูกต้อง");
    }

    if (typeof data.note !== "string") {
      throw new Error("รูปแบบบันทึกเพิ่มเติมไม่ถูกต้อง");
    }

    if (
      !Array.isArray(data.causes) ||
      data.causes.length !== 1 ||
      !data.causes[0]?.trim()
    ) {
      throw new Error("กรุณาเลือกสาเหตุให้ครบถ้วน");
    }

    return await repository.updateMoodLog(id, {
      ...data,
      causes: [data.causes[0].trim()],
    });
  },
  deleteMoodLog: async (id: string) => {
    if (!id) throw new Error("ไม่พบข้อมูล");
    return await repository.deleteMoodLog(id);
  },
});

export type InsightUseCases = ReturnType<typeof createInsightUseCases>;
