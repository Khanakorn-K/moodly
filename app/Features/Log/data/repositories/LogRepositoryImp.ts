import type { ILogRepository } from "../../domain/repositories/ILogRepository";
import type { AddMoodRequestModel } from "../models/AddMoodRequestModel";
import type { CauseEntity } from "../../domain/entities/CauseEntity";
import { LogApiDataSource } from "../dataSources/LogApiDataSource";
import { CauseMapper } from "../mappers/CauseMapper";

export const LogRepositoryImp: ILogRepository = {
  addMoodLog: async (data): Promise<void> => {
    const body: AddMoodRequestModel = data;
    await LogApiDataSource.addMoodLog(body);
  },

  addCause: async (data: { name: string }): Promise<void> => {
    await LogApiDataSource.addCause(data);
  },

  getCauses: async (): Promise<CauseEntity[]> => {
    const response = await LogApiDataSource.getCauses();
    return response.map((item) => CauseMapper.toEntity(item));
  },

  deleteCause: async (data: { id: string }): Promise<void> => {
    await LogApiDataSource.deleteCause(data.id);
  },
};
