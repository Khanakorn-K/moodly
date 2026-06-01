import type { ILogRepository } from "../../domain/repositories/ILogRepository";
import type { AddMoodRequestModel } from "../models/AddMoodRequestModel";
import type { CauseEntity } from "@/app/shared/entities/CauseEntity";
import { LogApiDataSource } from "../dataSources/LogApiDataSource";
import { CauseMapper } from "@/app/shared/mappers/CauseMapper";
import { convertDateToLocalISO } from "@/cores/utils/thaiDate";

export const LogRepositoryImpl: ILogRepository = {
  addMoodLog: async (data): Promise<void> => {
    const body: AddMoodRequestModel = {
      ...data,
      createdAt: convertDateToLocalISO(data.createdAt),
    };
    await LogApiDataSource.addMoodLog(body);
  },

  addCause: async (data: { name: string }): Promise<void> => {
    await LogApiDataSource.addCause(data);
  },

  updateCause: async (data: { id: string; name: string }): Promise<void> => {
    await LogApiDataSource.updateCause(data.id, { name: data.name });
  },

  getCauses: async (): Promise<CauseEntity[]> => {
    const response = await LogApiDataSource.getCauses();
    return response.map((item) => CauseMapper.toEntity(item));
  },

  deleteCause: async (data: { id: string }): Promise<void> => {
    await LogApiDataSource.deleteCause(data.id);
  },
};
