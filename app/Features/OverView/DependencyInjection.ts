import { OverViewRepositoryImpl } from "./data/repositories/OverCiewRepositotyImpl";
import { OverViewUsecase } from "./domain/usecase/OverViewUsecase";

export const makeOverViewUsecase = OverViewUsecase(OverViewRepositoryImpl);
