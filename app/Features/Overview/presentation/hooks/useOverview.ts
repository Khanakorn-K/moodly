import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  MonthlyAverageMoodEntity,
  OverviewEntity,
} from "../../domain/entities/OverviewEntity";
import { convertDateToYYMM, convertDateToYYMMDD } from "@/cores/utils/thaiDate";
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
  const [monthlyAverageMood, setMonthlyAverageMood] =
    useState<MonthlyAverageMoodEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(createDefaultStartDate);
  const [endDate, setEndDate] = useState<string>(() =>
    convertDateToYYMMDD(new Date()),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    convertDateToYYMM(new Date()),
  );

  const loadOverview = useCallback(
    async (
      data: { startDate: string; endDate: string } = { startDate, endDate },
    ) => {
      if (status !== "authenticated") return;

      setIsLoading(true);
      setError(null);
      try {
        const entity = await overviewUseCases.getOverview(data);
        setOverviewData(entity);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลภาพรวมได้";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [endDate, startDate, status],
  );

  const loadMonthlyAverageMood = useCallback(
    async (data: { month: string } = { month: selectedMonth }) => {
      if (status !== "authenticated") return;

      setIsMonthlyLoading(true);
      setMonthlyError(null);
      try {
        const entity = await overviewUseCases.getMonthlyAverageMood(data);
        setMonthlyAverageMood(entity);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "ไม่สามารถโหลดข้อมูลอารมณ์รายเดือนได้";
        setMonthlyError(message);
      } finally {
        setIsMonthlyLoading(false);
      }
    },
    [selectedMonth, status],
  );

  useEffect(() => {
    if (status !== "authenticated" || hasLoaded.current) return;

    hasLoaded.current = true;
    loadOverview({ startDate, endDate });
    loadMonthlyAverageMood({ month: selectedMonth });
  }, [
    endDate,
    loadMonthlyAverageMood,
    loadOverview,
    selectedMonth,
    startDate,
    status,
  ]);

  return {
    overviewData,
    monthlyAverageMood,
    isLoading,
    isMonthlyLoading,
    error,
    monthlyError,
    startDate,
    endDate,
    selectedMonth,
    setStartDate,
    setEndDate,
    setSelectedMonth,
    refresh: loadOverview,
    refreshMonthlyAverageMood: loadMonthlyAverageMood,
  };
};
