import { LogRepositoryImpl } from "./data/repositories/LogRepositoryImpl";
import { createLogUseCases } from "./domain/useCases/createLogUseCases";

export const logUseCases = createLogUseCases(LogRepositoryImpl);
