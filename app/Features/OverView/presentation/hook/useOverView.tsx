import { useEffect, useState } from "react";
import { makeOverViewUsecase } from "../../DependencyInjection";
import { OverViewEntity } from "../../domain/entity/OverViewEntity";
import { handleAppError } from "@/cors/utils/errorHandler";
import { inspectResponse } from "@/cors/utils/debugResponse";

export const useOverView = () => {
  const [overViewData, setOverViewData] = useState<OverViewEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const loadOverView = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const entity = await makeOverViewUsecase.fetchGetMoods(
        "2026-05-09",
        "2026-05-11",
      );
      setOverViewData(entity);
      inspectResponse(entity);
    } catch (err: any) {
      setError(err.message);
      handleAppError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverView();
  }, []);

  return {
    overViewData,
    isLoading,
    error,
    refresh: loadOverView,
  };
};
