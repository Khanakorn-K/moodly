import { apiClient } from "@/lib/api-client";
import { CausesResponseModel } from "../../../share/models/causesResponseModel";
import { CausesEntity } from "../../../share/entities/causesEntity";
import { getThailandTime } from "@/utils/thaiDate";

const dataSourcesLog = {
  addMood: async (
    selectedMood: number,
    selectedCauses: string[],
    note: string,
  ) => {
    const createdAt = getThailandTime();
    console.log("createdAt ==", createdAt);
    return apiClient.post("/moods", {
      mood: selectedMood,
      causes: selectedCauses,
      note: note,
      createdAt: createdAt,
    });
  },

  addCauses: async (name: string) => {
    const createdAt = getThailandTime();

    return apiClient.post("/causes", { name, createdAt });
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
