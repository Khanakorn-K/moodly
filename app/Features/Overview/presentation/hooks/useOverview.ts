import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { OverviewEntity } from "../../domain/entities/OverviewEntity";
import { handleAppError } from "@/cores/utils/errorHandler";
import { inspectResponse } from "@/cores/utils/debugResponse";
import { convertDateToYYMMDD } from "@/cores/utils/thaiDate";
import { overviewUseCases } from "../../dependencyInjection";

// Presentation layer เท่านั้น: เก็บ React/session/loading/error state ใน hook นี้.
// Business rules และ validation ต้องอยู่ที่ domain/useCases.
function createDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return convertDateToYYMMDD(date);
}

export const useOverview = () => {
  const { status } = useSession();
  const hasLoaded = useRef(false);
  const [overviewData, setOverviewData] = useState<OverviewEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(createDefaultStartDate);
  const [endDate, setEndDate] = useState<string>(() =>
    convertDateToYYMMDD(new Date()),
  );

  const loadOverview = useCallback(async (
    data: { startDate: string; endDate: string } = { startDate, endDate },
  ) => {
    if (status !== "authenticated") return;

    setIsLoading(true);
    setError(null);
    try {
      const entity = await overviewUseCases.getOverview(data);
      setOverviewData(entity);
      inspectResponse(entity);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลภาพรวมได้";
      setError(message);
      handleAppError(message);
    } finally {
      setIsLoading(false);
    }
  }, [endDate, startDate, status]);

  useEffect(() => {
    if (status !== "authenticated" || hasLoaded.current) return;

    hasLoaded.current = true;
    loadOverview({ startDate, endDate });
  }, [endDate, loadOverview, startDate, status]);

  return {
    overviewData,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    refresh: loadOverview,
  };
};
