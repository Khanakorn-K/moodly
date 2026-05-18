import type { ILandingRepository } from "../repositories/ILandingRepository";
import type { LandingEntity } from "../entities/LandingEntity";
import { findMoodLevelByDistributionKey } from "../constants/moodLevels";

export const createLandingUseCases = (repository: ILandingRepository) => ({
  getInsights: async (data: {
    selectedDate: string;
  }): Promise<LandingEntity> => {
    const entity = await repository.getInsights(data);

    let totalPoints = 0;
    let totalLogs = 0;

    Object.entries(entity?.moodDistribution ?? {}).forEach(([key, count]) => {
      const moodLevel = findMoodLevelByDistributionKey(key);
      const moodCount = Number(count);

      if (moodLevel && Number.isFinite(moodCount)) {
        totalPoints += moodLevel.value * moodCount;
        totalLogs += moodCount;
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
