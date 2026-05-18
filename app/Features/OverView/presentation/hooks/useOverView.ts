import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { OverViewEntity } from "../../domain/entities/OverViewEntity";
import { handleAppError } from "@/cors/utils/errorHandler";
import { inspectResponse } from "@/cors/utils/debugResponse";
import { convertDateToYYMMDD } from "@/cors/utils/thaiDate";
import { overViewUseCases } from "../../dependencyInjection";

// Presentation layer เท่านั้น: เก็บ React/session/loading/error state ใน hook นี้.
// Business rules และ validation ต้องอยู่ที่ domain/useCases.
function createDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return convertDateToYYMMDD(date);
}

export const useOverView = () => {
  const { status } = useSession();
  const hasLoaded = useRef(false);
  const [overViewData, setOverViewData] = useState<OverViewEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(createDefaultStartDate);
  const [endDate, setEndDate] = useState<string>(() =>
    convertDateToYYMMDD(new Date()),
  );

  const loadOverView = useCallback(async (
    data: { startDate: string; endDate: string } = { startDate, endDate },
  ) => {
    if (status !== "authenticated") return;

    setIsLoading(true);
    setError(null);
    try {
      const entity = await overViewUseCases.getOverView(data);
      setOverViewData(entity);
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
    loadOverView({ startDate, endDate });
  }, [endDate, loadOverView, startDate, status]);

  return {
    overViewData,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    refresh: loadOverView,
  };
};
