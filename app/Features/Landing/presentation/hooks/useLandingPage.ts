import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { moodColors } from "@/app/shared/moodColors";
import type { LandingEntity } from "../../domain/entities/LandingEntity";
import { standardMoods } from "@/app/shared/moodType";
import { landingUseCases } from "../../dependencyInjection";

const useLandingPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<LandingEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startMonth, setStartMonth] = useState<Date>(new Date());
  const [endMonth, setEndMonth] = useState<Date>(new Date());
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      if (status === "loading" || !date) return;

      setData(null);
      setIsLoading(true);

      try {
        const entity = await landingUseCases.getInsights({
          selectedDate: date,
        });
        setData(entity);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [status, date]);

  const firstName = session?.user?.name?.split(" ")[0] ?? "";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "อรุณสวัสดิ์" : hour < 18 ? "สวัสดีตอนบ่าย" : "สวัสดีตอนเย็น";

  const normalizedDist: Record<string, number> = {};

  Object.entries(data?.moodDistribution ?? {}).forEach(([k, v]) => {
    const moodConfig = standardMoods.find(
      (m) => m.label === k || m.value.toString() === k,
    );
    const key = moodConfig ? moodConfig.value.toString() : k;
    normalizedDist[key] = (normalizedDist[key] || 0) + (v as number);
  });

  const maxCount = Math.max(...Object.values(normalizedDist), 1);

  const moodChartData = standardMoods.map((moodItem) => {
    const levelStr = moodItem.value.toString();
    const count = normalizedDist[levelStr] ?? 0;

    const relatedCauses = data?.causesAnalysis
      ? Object.entries(data.causesAnalysis)
          .map(([causeName, moodCounts]) => {
            const moodCount = (moodCounts[levelStr] ||
              moodCounts[moodItem.label] ||
              0) as number;
            return { name: causeName, count: moodCount };
          })
          .filter((item) => item.count > 0)
          .map((item) => `${item.name} x${item.count}`)
      : [];

    return {
      label: moodItem.label,
      heightPercentage: count > 0 ? (count / maxCount) * 100 : 2,
      color: moodColors[moodItem.value] || "#118AB2",
      actualCount: count,
      causes: relatedCauses,
      date: date,
    };
  });

  const topCausesList = Object.entries(data?.causesAnalysis ?? {}).map(
    ([label, moodsAnal]) => {
      const totalCount = Object.values(moodsAnal).reduce(
        (a, b) => a + (b as number),
        0,
      );

      const moodBreakdown = standardMoods
        .map((m) => {
          const count = (moodsAnal[m.value.toString()] ||
            moodsAnal[m.label] ||
            0) as number;
          return {
            value: m.value,
            pct: totalCount > 0 ? (count / totalCount) * 100 : 0,
            color: moodColors[m.value],
          };
        })
        .filter((m) => m.pct > 0);

      const percentage = data?.totalLogs
        ? Math.round((totalCount / data.totalLogs) * 100)
        : 0;

      return {
        label,
        pct: percentage,
        moodBreakdown,
      };
    },
  );

  const calculateMoodColor = (value: number | null): string => {
    return moodColors[value ?? 1] || "#D1D5DB";
  };

  return {
    status,
    isLoading,
    firstName,
    greeting,
    data,
    moodChartData,
    topCausesList,
    date,
    setDate,
    averageMood: data?.averageMood ?? 0,
    calculateMoodColor,
    standardMoods,
    setStartMonth,
    endMonth,
    setEndMonth,
  };
};

export default useLandingPage;
