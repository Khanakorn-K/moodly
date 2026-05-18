import { apiClient } from "@/cores/lib/api-client";
import { AddMoodRequestModel } from "../models/AddMoodRequestModel";
import type { CauseResponseModel } from "@/app/shared/models/CauseResponseModel";
import { convertDateToLocalISO } from "@/cores/utils/thaiDate";

export const LogApiDataSource = {
  addMoodLog: async (body: AddMoodRequestModel) => {
    const createdAt = convertDateToLocalISO(new Date());
    await apiClient.post("/mood-logs/create-mood-log", {
      mood: body.selectedMood,
      causes: body.selectedCauses,
      note: body.note,
      createdAt,
    });
  },

  addCause: async (body: { name: string }) => {
    const createdAt = convertDateToLocalISO(new Date());
    await apiClient.post("/custom-causes/create-custom-cause", {
      name: body.name,
      createdAt,
    });
  },

  updateCause: async (id: string, body: { name: string }) => {
    await apiClient.patch(`/custom-causes/update-custom-cause/${id}`, body);
  },

  getCauses: async (): Promise<CauseResponseModel[]> => {
    return await apiClient.get<CauseResponseModel[]>(
      "/custom-causes/get-custom-causes",
    );
  },

  deleteCause: async (id: string) => {
    await apiClient.delete(`/custom-causes/delete-custom-cause/${id}`);
  },
};
