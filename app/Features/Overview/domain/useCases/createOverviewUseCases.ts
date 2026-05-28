import {
  MonthlyAverageMoodEntity,
  OverviewEntity,
} from "../entities/OverviewEntity";
import { IOverviewRepository } from "../repositories/IOverviewRepository";

export const createOverviewUseCases = (repository: IOverviewRepository) => ({
  getOverview: async (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverviewEntity> => {
    // Domain layer เท่านั้น: validation ของ business behavior ต้องอยู่ตรงนี้.
    if (!data.startDate) throw new Error("กรุณาเลือกวันเริ่มต้น");
    if (!data.endDate) throw new Error("กรุณาเลือกวันสิ้นสุด");
    if (data.startDate > data.endDate) {
      throw new Error("วันเริ่มต้นต้องไม่มากกว่าวันสิ้นสุด");
    }

    return repository.getOverview(data);
  },

  getMonthlyAverageMood: async (data: {
    month: string;
  }): Promise<MonthlyAverageMoodEntity> => {
    if (!data.month) throw new Error("กรุณาเลือกเดือน");
    if (!/^\d{4}-\d{2}$/.test(data.month)) {
      throw new Error("รูปแบบเดือนต้องเป็น YYYY-MM");
    }
    const month = Number(data.month.split("-")[1]);
    if (month < 1 || month > 12) {
      throw new Error("เดือนต้องอยู่ระหว่าง 01 ถึง 12");
    }

    return repository.getMonthlyAverageMood(data);
  },
});
