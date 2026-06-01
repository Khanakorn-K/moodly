import { apiClient } from "@/cores/lib/api-client";
import type { apiResponseBase } from "@/cores/utils/apiResponseBase";
import { AddMoodRequestModel } from "../models/AddMoodRequestModel";
import type { CauseResponseModel } from "@/app/shared/models/CauseResponseModel";
import { convertDateToLocalISO } from "@/cores/utils/thaiDate";

export const LogApiDataSource = {
  addMoodLog: async (body: AddMoodRequestModel): Promise<void> => {
    await apiClient.post<apiResponseBase<unknown>>(
      "/mood-logs/create-mood-log",
      {
        mood: body.selectedMood,
        causes: body.selectedCauses,
        note: body.note,
        createdAt: body.createdAt,
      },
    );
  },

  addCause: async (body: { name: string }): Promise<void> => {
    const createdAt = convertDateToLocalISO(new Date());
    await apiClient.post<apiResponseBase<unknown>>(
      "/custom-causes/create-custom-cause",
      {
        name: body.name,
        createdAt,
      },
    );
  },

  updateCause: async (id: string, body: { name: string }): Promise<void> => {
    await apiClient.patch<apiResponseBase<unknown>>(
      `/custom-causes/update-custom-cause/${id}`,
      body,
    );
  },

  getCauses: async (): Promise<CauseResponseModel[]> => {
    const response = await apiClient.get<apiResponseBase<CauseResponseModel[]>>(
      "/custom-causes/get-custom-causes",
    );
    return response.data;
  },

  deleteCause: async (id: string): Promise<void> => {
    await apiClient.delete<apiResponseBase<unknown>>(
      `/custom-causes/delete-custom-cause/${id}`,
    );
  },
};
