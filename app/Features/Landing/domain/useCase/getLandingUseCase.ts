import { ILandingRepository } from "../repositories/ILandingRepository";
import { standartMoods } from "@/app/share/moodType";
import { LandingEntity } from "../entity/LandingEntity";

export const getLandingUseCase = (repository: ILandingRepository) => ({
  getInsightsUseCase: async (dateString: string): Promise<LandingEntity> => {
    const data = await repository.fetchGetInsights(dateString);

    let totalPoints = 0;
    let totalLogs = 0;

    Object.entries(data?.moodDistribution ?? {}).forEach(([key, count]) => {
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
      totalLogs: data?.totalLogs ?? 0,
      moodDistribution: data?.moodDistribution ?? {},
      causesAnalysis: data?.causesAnalysis ?? {},
      averageMood: calculatedAverage,
    };
  },
});
