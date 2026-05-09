import { LandingRepositoryImpl } from "./data/repositories/LandingRepositoryImpl";
import { getLandingUseCase } from "./domain/useCase/getLandingUseCase";

const dataSource = LandingRepositoryImpl;
export const makeGetLandingUseCase = getLandingUseCase(dataSource);
