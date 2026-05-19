import { apiClient } from "@/cores/lib/api-client";
import type { apiResponseBase } from "@/cores/utils/apiResponseBase";
import type { InsightsResponseModel } from "../models/InsightsResponseModel";

export const LandingApiDataSource = {
  getInsights: async (data: {
    selectedDate?: string;
  }): Promise<InsightsResponseModel> => {
    const response = await apiClient.get<apiResponseBase<InsightsResponseModel>>(
      "/insights/get-insights",
      {
        params: {
          ...(data.selectedDate ? { selectedDate: data.selectedDate } : {}),
        },
      },
    );
    return response.data;
  },
};
