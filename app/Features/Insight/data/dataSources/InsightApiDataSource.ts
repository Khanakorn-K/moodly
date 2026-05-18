import { apiClient } from "@/cors/lib/api-client";
import type { CauseResponseModel } from "../models/CauseResponseModel";
import type { MoodLogsResponseModel } from "../models/MoodLogsResponseModel";
import type { UpdateMoodLogRequestModel } from "../models/UpdateMoodLogRequestModel";

export const InsightApiDataSource = {
  getMoodLogs: async ({
    page = 1,
    limit = 10,
    mood,
    startDate,
    endDate,
  }: {
    page?: number;
    limit?: number;
    mood?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MoodLogsResponseModel> => {
    const response = await apiClient.get<MoodLogsResponseModel>(
      "/mood-logs/get-mood-logs",
      {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          ...(mood ? { mood } : {}),
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      },
    );
    return response;
  },

  updateMoodLog: async (id: string, body: UpdateMoodLogRequestModel) => {
    return await apiClient.put(`/mood-logs/update-mood-log/${id}`, body);
  },

  deleteMoodLog: async (id: string) => {
    return await apiClient.delete(`/mood-logs/delete-mood-log/${id}`);
  },

  getCauses: async (): Promise<CauseResponseModel[]> => {
    return await apiClient.get<CauseResponseModel[]>(
      "/custom-causes/get-custom-causes",
    );
  },
};
