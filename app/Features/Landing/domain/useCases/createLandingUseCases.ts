import type { ILandingRepository } from "../repositories/ILandingRepository";
import { standartMoods } from "@/app/share/moodType";
import type { LandingEntity } from "../entities/LandingEntity";

export const createLandingUseCases = (repository: ILandingRepository) => ({
  getInsights: async (data: {
    selectedDate: string;
  }): Promise<LandingEntity> => {
    const entity = await repository.getInsights(data);

    let totalPoints = 0;
    let totalLogs = 0;

    Object.entries(entity?.moodDistribution ?? {}).forEach(([key, count]) => {
      const moodConfig = standartMoods.find(
        (m) => m.label === key || m.value.toString() === key,
      );
      if (moodConfig) {
        totalPoints += moodConfig.value * (count as number);
        totalLogs += count as number;
      }
    });

    const calculatedAverage =
      totalLogs === 0 ? 0 : Number((totalPoints / totalLogs).toFixed(1));

    return {
      totalLogs: entity?.totalLogs ?? 0,
      moodDistribution: entity?.moodDistribution ?? {},
      causesAnalysis: entity?.causesAnalysis ?? {},
      averageMood: calculatedAverage,
    };
  },
});

export type LandingUseCases = ReturnType<typeof createLandingUseCases>;
