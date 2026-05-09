import { ILogRepository } from "../../domain/repositories/ILogRepository";
import { CausesEntity } from "@/app/share/entities/causesEntity";
import { AddMoodRequestModel } from "../models/AddMoodRequestModel";
import { LogApiDataSource } from "../dataSource/LogApiDataSource";

//หน้านี้ต้อง returnเป็น entity เท่านั้น เพราะILogRepository ต้องรู้จักแค่ entity ใน layer มันเองเท่านั้น
export const LogRepositoryImpl: ILogRepository = {
  fetchAddMood: async (selectedMood, selectedCauses, note) => {
    const body: AddMoodRequestModel = { selectedMood, selectedCauses, note };
    return await LogApiDataSource.fetchAddMood(body);
  },

  fetchAddCauses: async (name: string) => {
    return await LogApiDataSource.fetchAddCause(name);
  },

  fetchGetMyCauses: async (): Promise<CausesEntity[]> => {
    const data = await LogApiDataSource.fetchGetCauses();
    // ทำหน้าที่แปลง Model (Data) ให้เป็น Entity (Domain) ที่นี่
    return data.map((item) => new CausesEntity(item));
  },

  fetchDeleteMyCauses: async (id: string) => {
    return await LogApiDataSource.fetchDeleteCause(id);
  },
};
