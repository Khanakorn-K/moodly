import { apiClient } from "@/cores/lib/api-client";
import type { apiResponseBase } from "@/cores/utils/apiResponseBase";
import type { CauseResponseModel } from "@/app/shared/models/CauseResponseModel";
import type { MoodLogsResponseModel } from "../models/MoodLogsResponseModel";
import type { UpdateMoodLogRequestModel } from "../models/UpdateMoodLogRequestModel";

export const InsightApiDataSource = {
  getMoodLogs: async ({
    mood,
    startDate,
    endDate,
  }: {
    mood?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MoodLogsResponseModel> => {
    const response = await apiClient.get<apiResponseBase<MoodLogsResponseModel>>(
      "/mood-logs/get-mood-logs",
      {
        params: {
          ...(mood ? { mood } : {}),
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      },
    );
    return response.data;
  },

  updateMoodLog: async (
    id: string,
    body: UpdateMoodLogRequestModel,
  ): Promise<void> => {
    await apiClient.put<apiResponseBase<unknown>>(
      `/mood-logs/update-mood-log/${id}`,
      body,
    );
  },

  deleteMoodLog: async (id: string): Promise<void> => {
    await apiClient.delete<apiResponseBase<unknown>>(
      `/mood-logs/delete-mood-log/${id}`,
    );
  },

  getCauses: async (): Promise<CauseResponseModel[]> => {
    const response = await apiClient.get<apiResponseBase<CauseResponseModel[]>>(
      "/custom-causes/get-custom-causes",
    );
    return response.data;
  },
};
