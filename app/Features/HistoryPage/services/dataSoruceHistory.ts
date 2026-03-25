import { apiClient } from "@/lib/api-client";
import { moodsModelResponse } from "../models/moodsModel";
import { moodsEntity } from "../entity/moodsEntity";
import { CausesEntity } from "../../../share/entities/causesEntity";
import { CausesResponseModel } from "../../../share/models/causesResponseModel";

const dataSourceHistory = {
  getMoods: async (
    page: number = 1,
    limit: number = 10,
    mood?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<moodsEntity> => {
    const response = await apiClient.get<moodsModelResponse>("/moods", {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...(mood ? { mood } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    });
    return new moodsEntity(response);
  },

  updateMood: async (
    id: string,
    body: { mood: number; note?: string; causes?: string[] },
  ) => {
    return await apiClient.put(`/moods/${id}`, body);
  },

  deleteMood: async (id: string) => {
    return await apiClient.delete(`/moods/${id}`);
  },

  getMyCauses: async (): Promise<CausesEntity[]> => {
    const response = await apiClient.get<CausesResponseModel[]>("/causes");
    return response.map((item) => new CausesEntity(item));
  },
};

export default dataSourceHistory;
