import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dataSourceLandingPage from "../services/dataSourceLandingPage";
import { InsightsEntity } from "../entity/InsightsEntity";
import { moods } from "../../LogPage/types/moodType";

const CAUSE_COLORS = ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#A78BFA"];

const useLandingPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<InsightsEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (status === "loading") return;
      if (status === "unauthenticated") {
        setIsLoading(false);
        return;
      }
      try {
        const entity = await dataSourceLandingPage.getLandingData();
        setData(entity);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [status, session]);

  const firstName = session?.user?.name?.split(" ")[0] ?? "มาสเตอร์";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "อรุณสวัสดิ์" : hour < 18 ? "สวัสดีตอนบ่าย" : "สวัสดีตอนเย็น";

  const allMoodLevels = [1, 2, 3, 4, 5];

  const normalizedDist: Record<string, number> = {};

  Object.entries(data?.moodDistribution ?? {}).forEach(([k, v]) => {
    const moodConfig = moods.find((m) => m.label === k);

    const key = moodConfig ? moodConfig.value.toString() : k;

    normalizedDist[key] = (normalizedDist[key] || 0) + (v as number);
  });

  const maxCount = Math.max(...Object.values(normalizedDist), 1);

  const moodChartData = allMoodLevels.map((level) => {
    const levelStr = level.toString();
    const count = normalizedDist[levelStr] ?? 0;

    const moodConfig = moods[level - 1];

    const relatedCauses = data?.causesAnalysis
      ? Object.entries(data.causesAnalysis)
          .map(([causeName, moodCounts]) => {
            const moodCount = (moodCounts[levelStr] ||
              moodCounts[moodConfig.label] ||
              0) as number;
            return { name: causeName, count: moodCount };
          })
          .filter((item) => item.count > 0)
          .map((item) => `${item.name} x${item.count}`)
      : [];

    return {
      label: moodConfig.label,
      heightPercentage: count > 0 ? (count / maxCount) * 100 : 2,
      color: level <= 2 ? "#EF476F" : level >= 4 ? "#06D6A0" : "#118AB2",
      actualCount: count,
      causes: relatedCauses,
    };
  });

  const topCausesList = Object.entries(data?.causesAnalysis ?? {}).map(
    ([label, moods], i) => {
      const totalCount = Object.values(moods).reduce(
        (a, b) => a + (b as number),
        0,
      );
      const percentage = data?.totalLogs
        ? Math.round((totalCount / data.totalLogs) * 100)
        : 0;
      return {
        label,
        pct: percentage,
        color: CAUSE_COLORS[i % CAUSE_COLORS.length],
      };
    },
  );

  return {
    status,
    isLoading,
    firstName,
    greeting,
    data,
    moodChartData,
    topCausesList,
  };
};

export default useLandingPage;
