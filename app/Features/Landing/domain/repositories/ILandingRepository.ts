import type { LandingEntity } from "../entities/LandingEntity";

export interface ILandingRepository {
  getInsights: (data: { selectedDate: Date }) => Promise<LandingEntity>;
}
