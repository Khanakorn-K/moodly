import { LogRepositoryImpl } from "./data/repositories/LogRepositoryImpl.ts";
import { makeLogUseCase } from "./domain/useCase/LogUseCase";
const dataSource = LogRepositoryImpl;
export const moodLogUseCase = makeLogUseCase(dataSource);
