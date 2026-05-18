import { OverViewEntity } from "../../domain/entity/OverViewEntity";
import { IOverViewRepository } from "../../domain/repositories/IOverViewRepository";
import { OverViewApiDataSource } from "../dataSource/OverViewApiDataSource";
import { overViewMapper } from "../mappers/overViewMapper";

export const OverViewRepositoryImpl: IOverViewRepository = {
  fetchGetMoods: async function (
    startDate: string,
    endDate: string,
  ): Promise<OverViewEntity> {
    const response = await OverViewApiDataSource.getMoods(startDate, endDate);
    return overViewMapper.toEntity(response);
  },
};
