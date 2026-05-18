import { apiClient } from "@/cors/lib/api-client";
import { moodsLogModelResponse } from "../models/moodLogResponseModel";

export const OverViewApiDataSource = {
  getMoods: function (
    startDate: string,
    endDate: string,
  ): Promise<moodsLogModelResponse> {
    return apiClient.get<moodsLogModelResponse>("/moods", {
      params: {
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    });
  },
};
