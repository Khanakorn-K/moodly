import { OverViewEntity } from "../entity/OverViewEntity";
import { IOverViewRepository } from "../repositories/IOverViewRepository";

export const OverViewUsecase = (repository: IOverViewRepository) => ({
  // calculateTotalDate: (startDat: Date, endDAte: Date): number => {
  //   return 1;
  // },
  fetchGetMoods: async (
    startDate: string,
    endDate: string,
  ): Promise<OverViewEntity> => {
    if (!startDate) throw new Error("กรุณาเลือกวันเริ่มต้น");
    if (!endDate) throw new Error("กรุณาเลือกวันจบ");

    const dto = await repository.fetchGetMoods(startDate, endDate);

    if (!dto || !dto.data || !Array.isArray(dto.data)) {
      return {
        moodDateAvg: [],
        fromDate: startDate,
        todate: endDate,
        totalDate: 0,
      };
    }

    const dailyData: Record<string, { total: number; count: number }> = {};

    dto.data.forEach((log: any) => {
      const date = log.createdAt.split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = { total: 0, count: 0 };
      }
      dailyData[date].total += Number(log.mood);
      dailyData[date].count += 1;
    });

    const moodDateAvg = Object.values(dailyData).map((day) =>
      Number((day.total / day.count).toFixed(1)),
    );

    return {
      moodDateAvg,
      fromDate: startDate,
      todate: endDate,
      totalDate: moodDateAvg.length,
    };
  },
});
