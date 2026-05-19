import { LandingRepositoryImpl } from "./data/repositories/LandingRepositoryImpl";
import { createLandingUseCases } from "./domain/useCases/createLandingUseCases";

export const landingUseCases = createLandingUseCases(LandingRepositoryImpl);
