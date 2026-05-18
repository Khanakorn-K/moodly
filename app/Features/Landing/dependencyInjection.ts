import { LandingRepositoryImp } from "./data/repositories/LandingRepositoryImp";
import { createLandingUseCases } from "./domain/useCases/createLandingUseCases";

export const landingUseCases = createLandingUseCases(LandingRepositoryImp);
