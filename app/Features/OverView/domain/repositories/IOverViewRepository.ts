import { OverViewEntity } from "../entities/OverViewEntity";

export interface IOverViewRepository {
  getOverView: (data: {
    startDate: string;
    endDate: string;
  }) => Promise<OverViewEntity>;
}
