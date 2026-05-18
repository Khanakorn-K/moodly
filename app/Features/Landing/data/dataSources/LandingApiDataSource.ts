import { apiClient } from "@/cors/lib/api-client";
import type { InsightsResponseModel } from "../models/InsightsResponseModel";

export const LandingApiDataSource = {
  getInsights: async (data: {
    selectedDate?: string;
  }): Promise<InsightsResponseModel> => {
    const response = await apiClient.get<InsightsResponseModel>(
      "/insights/get-insights",
      {
        params: {
          ...(data.selectedDate ? { selectedDate: data.selectedDate } : {}),
        },
      },
    );
    return response;
  },
};
