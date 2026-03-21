import { apiClient } from "@/lib/api-client";
import { CausesResponseModel } from "../models/causesResponseModel";
import { CausesEntity } from "../entity/causesEntity";

const dataSourcesLog = {
  addMood: async (
    selectedMood: string,
    selectedCauses: string[],
    note: string,
  ) => {
    return apiClient.post("/moods", {
      mood: selectedMood,
      causes: selectedCauses,
      note: note,
    });
  },

  addCauses: async (name: string) => {
    return apiClient.post("/causes", { name });
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
