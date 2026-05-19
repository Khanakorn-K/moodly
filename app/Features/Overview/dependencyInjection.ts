import { OverviewRepositoryImpl } from "./data/repositories/OverviewRepositoryImpl";
import { createOverviewUseCases } from "./domain/useCases/createOverviewUseCases";

export const overviewUseCases = createOverviewUseCases(OverviewRepositoryImpl);
