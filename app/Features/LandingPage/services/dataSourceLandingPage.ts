import { apiClient } from "@/lib/api-client";
import { InsightsModel } from "../models/InsightsModel";
import { InsightsEntity } from "../entity/InsightsEntity";

const dataSourceLandingPage = {
  getInsights: async (singleDate?: string): Promise<InsightsEntity> => {
    const response = await apiClient.get<InsightsModel>("/insights", {
      params: {
        ...(singleDate ? { startDate: singleDate } : {}), 
      },
    });
    return new InsightsEntity(response);
  },
};

export default dataSourceLandingPage;
