import { LogRepositoryImpl } from "./data/repositories/LogRepositoryImpl.ts";
import { getLogUseCase } from "./domain/useCase/getLogUseCase";

const dataSource = LogRepositoryImpl;
export const makeGetLogUseCase = getLogUseCase(dataSource);
