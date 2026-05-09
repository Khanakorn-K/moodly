import { CausesEntity } from "@/app/share/entities/causesEntity";

export interface ILogRepository {
  fetchAddMood: (
    selectedMood: number,
    selectedCauses: string[],
    note: string,
  ) => Promise<any>;
  fetchAddCauses: (name: string) => Promise<any>;
  fetchGetMyCauses: () => Promise<CausesEntity[]>;
  fetchDeleteMyCauses: (id: string) => Promise<any>;
}
