import { apiClient } from "@/lib/api-client";
import { moodsModelResponse } from "../models/moodsModel";
import { moodsEntity } from "../entity/moodsEntity";

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

  // createMood: async (body: {
  //   mood: s;
  //   note?: string;
  //   causes?: string[];
  // }) => {
  //   return await apiClient.post("/moods", body);
  // },

  updateMood: async (
    id: string,
    body: { mood?: number; note?: string; causes?: string[] },
  ) => {
    return await apiClient.patch(`/moods/${id}`, body);
  },

  deleteMood: async (id: string) => {
    return await apiClient.delete(`/moods/${id}`);
  },
};

export default dataSourceHistory;
