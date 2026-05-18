import { OverViewEntity } from "../entity/OverViewEntity";

export interface IOverViewRepository {
  fetchGetMoods: (
    startDate: string,
    endDate: string,
  ) => Promise<OverViewEntity>;
}
