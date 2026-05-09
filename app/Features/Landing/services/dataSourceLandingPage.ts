import { apiClient } from "@/cors/lib/api-client";
import { InsightsModel } from "./models/InsightsModel";
import { LandingEntity } from "../domain/entity/LandingEntity";

const dataSourceLandingPage = {
  getInsights: async (selectedDate?: string): Promise<LandingEntity> => {
    const response = await apiClient.get<InsightsModel>("/insights", {
      params: {
        ...(selectedDate ? { selectedDate: selectedDate } : {}),
      },
    });
    // inspectResponse(response,"/insights")
    return new LandingEntity(response);
  },
};

export default dataSourceLandingPage;
