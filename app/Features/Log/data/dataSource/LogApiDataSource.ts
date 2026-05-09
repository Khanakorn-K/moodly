import { apiClient } from "@/cors/lib/api-client";
import { AddMoodRequestModel } from "../models/AddMoodRequestModel";
import { CausesResponseModel } from "@/app/share/models/causesResponseModel";
import { convertDateToLocalISO } from "@/cors/utils/thaiDate";

//model ที่ใช้ต้องเป็น model ใน layer data เท่านั้นเพราะหน้านี้เป็น DTO
export const LogApiDataSource = {
  fetchAddMood: async (body: AddMoodRequestModel) => {
    const createdAt = convertDateToLocalISO(new Date());
    return apiClient.post("/moods", {
      mood: body.selectedMood,
      causes: body.selectedCauses,
      note: body.note,
      createdAt,
    });
  },

  fetchAddCause: async (name: string) => {
    const createdAt = convertDateToLocalISO(new Date());
    return apiClient.post("/causes", { name, createdAt });
  },

  fetchGetCauses: async () => {
    return await apiClient.get<CausesResponseModel[]>("/causes");
  },

  fetchDeleteCause: async (id: string) => {
    return apiClient.delete(`/causes/${id}`);
  },
};
