import { OverViewEntity } from "../../domain/entities/OverViewEntity";
import { IOverViewRepository } from "../../domain/repositories/IOverViewRepository";
import { OverViewApiDataSource } from "../dataSources/OverViewApiDataSource";
import { OverViewMapper } from "../mappers/overViewMapper";

// Data layer เท่านั้น: เรียก dataSource และ map DTO -> domain entity.
// ห้ามใส่ UI state หรือ business validation ใน repository นี้.
export const OverViewRepositoryImp: IOverViewRepository = {
  getOverView: async function (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverViewEntity> {
    const response = await OverViewApiDataSource.getOverView(data);
    return OverViewMapper.toEntity(response);
  },
};
