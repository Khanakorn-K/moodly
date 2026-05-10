import { InsightRepositoryImpl } from "./data/repositories/InsightRepositoryImpl";
import { InsightUseCase } from "./domain/usecase/InsightUseCase";

export const insightUseCase = InsightUseCase(InsightRepositoryImpl);
