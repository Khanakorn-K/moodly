import { OverViewRepositoryImp } from "./data/repositories/OverViewRepositoryImp";
import { createOverViewUseCases } from "./domain/useCases/createOverViewUseCases";

export const overViewUseCases = createOverViewUseCases(OverViewRepositoryImp);
