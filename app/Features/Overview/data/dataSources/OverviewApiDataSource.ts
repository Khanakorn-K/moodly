import { apiClient } from "@/cores/lib/api-client";
import type { apiResponseBase } from "@/cores/utils/apiResponseBase";
import { OverviewResponseModel } from "../models/OverviewResponseModel";

export const OverviewApiDataSource = {
  getOverview: async function (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverviewResponseModel> {
    const response = await apiClient.get<apiResponseBase<OverviewResponseModel>>(
      "/overview/get-overview",
      {
        params: {
          startDate: data.startDate,
          endDate: data.endDate,
        },
      },
    );

    return response.data;
  },
};
