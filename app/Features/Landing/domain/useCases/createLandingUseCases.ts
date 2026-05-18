import type { ILandingRepository } from "../repositories/ILandingRepository";
import type { LandingEntity } from "../entities/LandingEntity";

export const createLandingUseCases = (repository: ILandingRepository) => ({
  getInsights: async (data: {
    selectedDate: string;
  }): Promise<LandingEntity> => {
    const entity = await repository.getInsights(data);

    return {
      totalLogs: entity?.totalLogs ?? 0,
      moodDistribution: entity?.moodDistribution ?? {},
      causesAnalysis: entity?.causesAnalysis ?? {},
      averageMood: entity?.averageMood ?? 0,
    };
  },
});

export type LandingUseCases = ReturnType<typeof createLandingUseCases>;
