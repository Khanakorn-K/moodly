import { apiClient } from "@/cors/lib/api-client";
import { moodsLogModelResponse } from "../models/moodsLogResponseModel";
import { CausesResponseModel } from "../models/causesResponseModel";

const InsightApiDataSource = {
  getMoods: async (
    page: number = 1,
    limit: number = 10,
    mood?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<moodsLogModelResponse> => {
    const response = await apiClient.get<moodsLogModelResponse>("/moods", {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...(mood ? { mood } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    });
    return response;
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

  getMyCauses: async (): Promise<CausesResponseModel[]> => {
    return await apiClient.get<CausesResponseModel[]>("/causes");
  },
};

export default InsightApiDataSource;
