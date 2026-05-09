import { apiClient } from "@/cors/lib/api-client";
import { InsightsResponseModel } from "../models/InsightsResponseModel";

const LandingApiDataSource = {
  getInsights: async (
    selectedDate?: string,
  ): Promise<InsightsResponseModel> => {
    const response = await apiClient.get<InsightsResponseModel>("/insights", {
      params: {
        ...(selectedDate ? { selectedDate: selectedDate } : {}),
      },
    });
    return response;
  },
};

export default LandingApiDataSource;
