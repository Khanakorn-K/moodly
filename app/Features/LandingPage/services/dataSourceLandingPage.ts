import { apiClient } from "@/lib/api-client";
import { InsightsModel } from "../models/InsightsModel";
import { InsightsEntity } from "../entity/InsightsEntity";

const dataSourceLandingPage = {
  getLandingData: async (): Promise<InsightsEntity> => {
    const response = await apiClient.get<InsightsModel>("/insights");
    return new InsightsEntity(response);
  },
};

export default dataSourceLandingPage;
