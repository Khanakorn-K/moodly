import type { LandingEntity } from "../entities/LandingEntity";

export interface ILandingRepository {
  getInsights: (data: { selectedDate: string }) => Promise<LandingEntity>;
}
