import { OverViewEntity } from "../../domain/entities/OverViewEntity";
import { IOverViewRepository } from "../../domain/repositories/IOverViewRepository";
import { OverViewApiDataSource } from "../dataSources/OverViewApiDataSource";
import { OverViewMapper } from "../mappers/OverViewMapper";

export const OverViewRepositoryImp: IOverViewRepository = {
  getOverView: async function (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverViewEntity> {
    const response = await OverViewApiDataSource.getOverView(data);
    return OverViewMapper.toEntity(response);
  },
};
