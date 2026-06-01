import type { LandingEntity } from "../../domain/entities/LandingEntity";
import type { ILandingRepository } from "../../domain/repositories/ILandingRepository";
import { LandingApiDataSource } from "../dataSources/LandingApiDataSource";
import { LandingMapper } from "../mappers/LandingMapper";
import { convertDateToYYMMDD } from "@/cores/utils/thaiDate";

export const LandingRepositoryImpl: ILandingRepository = {
  getInsights: async (data: {
    selectedDate: Date;
  }): Promise<LandingEntity> => {
    const response = await LandingApiDataSource.getInsights({
      selectedDate: convertDateToYYMMDD(data.selectedDate),
    });
    return LandingMapper.toEntity(response);
  },
};
