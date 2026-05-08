import { apiClient } from "@/cors/lib/api-client";
import { InsightsModel } from "../models/InsightsModel";
import { InsightsEntity } from "../entity/InsightsEntity";

const dataSourceLandingPage = {
  getInsights: async (selectedDate?: string): Promise<InsightsEntity> => {
    const response = await apiClient.get<InsightsModel>("/insights", {
      params: {
        ...(selectedDate ? { selectedDate: selectedDate } : {}),
      },
    });
    // inspectResponse(response,"/insights")
    return new InsightsEntity(response);
  },
};

export default dataSourceLandingPage;
