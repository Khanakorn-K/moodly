import { apiClient } from "@/cors/lib/api-client";
import { CausesResponseModel } from "../../../share/models/causesResponseModel";
import { CausesEntity } from "../../../share/entities/causesEntity";
import { convertDateToLocalISO } from "@/cors/utils/thaiDate";

const dataSourcesLog = {
  addMood: async (
    selectedMood: number,
    selectedCauses: string[],
    note: string,
  ) => {
    const date = new Date();
    const createdAt = convertDateToLocalISO(date);
    return apiClient.post("/moods", {
      mood: selectedMood,
      causes: selectedCauses,
      note: note,
      createdAt: createdAt,
    });
  },

  addCauses: async (name: string) => {
    const date = new Date();
    const createdAt = convertDateToLocalISO(date);

    return apiClient.post("/causes", { name: name, createdAt: createdAt });
  },

  getMyCauses: async (): Promise<CausesEntity[]> => {
    const response = await apiClient.get<CausesResponseModel[]>("/causes");
    return response.map((item) => new CausesEntity(item));
  },
  deleteMyCauses: async (id: string) => {
    return apiClient.delete(`/causes/${id}`);
  },
};

export default dataSourcesLog;
