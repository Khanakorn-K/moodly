import { InsightRepositoryImp } from "./data/repositories/InsightRepositoryImp";
import { createInsightUseCases } from "./domain/useCases/createInsightUseCases";

export const insightUseCases = createInsightUseCases(InsightRepositoryImp);
