import { apiClient } from "@/cores/lib/api-client";
import type { apiResponseBase } from "@/cores/utils/apiResponseBase";
import { OverViewResponseModel } from "../models/OverViewResponseModel";

export const OverViewApiDataSource = {
  getOverView: async function (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverViewResponseModel> {
    const response = await apiClient.get<apiResponseBase<OverViewResponseModel>>(
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
