import { LogRepositoryImp } from "./data/repositories/LogRepositoryImp";
import { createLogUseCases } from "./domain/useCases/createLogUseCases";

export const logUseCases = createLogUseCases(LogRepositoryImp);
