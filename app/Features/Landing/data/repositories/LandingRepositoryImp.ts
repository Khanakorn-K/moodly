import type { LandingEntity } from "../../domain/entities/LandingEntity";
import type { ILandingRepository } from "../../domain/repositories/ILandingRepository";
import { LandingApiDataSource } from "../dataSources/LandingApiDataSource";
import { LandingMapper } from "../mappers/LandingMapper";

export const LandingRepositoryImp: ILandingRepository = {
  getInsights: async (data: {
    selectedDate: string;
  }): Promise<LandingEntity> => {
    const response = await LandingApiDataSource.getInsights(data);
    return LandingMapper.toEntity(response);
  },
};
