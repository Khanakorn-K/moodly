import { OverviewEntity } from "../entities/OverviewEntity";
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
});
