import { InsightRepositoryImpl } from "./data/repositories/InsightRepositoryImpl";
import { createInsightUseCases } from "./domain/useCases/createInsightUseCases";

export const insightUseCases = createInsightUseCases(InsightRepositoryImpl);
