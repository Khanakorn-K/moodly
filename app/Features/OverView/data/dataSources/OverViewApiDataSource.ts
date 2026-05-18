import { apiClient } from "@/cores/lib/api-client";
import { OverViewResponseModel } from "../models/OverViewResponseModel";

export const OverViewApiDataSource = {
  getOverView: function (data: {
    startDate: string;
    endDate: string;
  }): Promise<OverViewResponseModel> {
    return apiClient.get<OverViewResponseModel>("/overview/get-overview", {
      params: {
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
  },
};
