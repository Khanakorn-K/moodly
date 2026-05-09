import { LandingEntity } from "../entity/LandingEntity";

export interface ILandingRepository {
  fetchGetInsights: (date: string) => Promise<LandingEntity>;
}
