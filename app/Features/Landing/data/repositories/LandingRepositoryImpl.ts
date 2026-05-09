import { LandingEntity } from "../../domain/entity/LandingEntity";
import { ILandingRepository } from "../../domain/repositories/ILandingRepository";
import LandingApiDataSource from "../dataSource/LandingApiDataSource";
import { LandingMapper } from "../mappers/LandingMapper";

export const LandingRepositoryImpl: ILandingRepository = {
  fetchGetInsights: async (date: string): Promise<LandingEntity> => {
    const data = await LandingApiDataSource.getInsights(date);
    return LandingMapper.toEntity(data);
  },
};
