import { OverViewEntity } from "../entities/OverViewEntity";
import { IOverViewRepository } from "../repositories/IOverViewRepository";

export const createOverViewUseCases = (repository: IOverViewRepository) => ({
  getOverView: async (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverViewEntity> => {
    if (!data.startDate) throw new Error("กรุณาเลือกวันเริ่มต้น");
    if (!data.endDate) throw new Error("กรุณาเลือกวันสิ้นสุด");
    if (data.startDate > data.endDate) {
      throw new Error("วันเริ่มต้นต้องไม่มากกว่าวันสิ้นสุด");
    }

    return repository.getOverView(data);
  },
});
