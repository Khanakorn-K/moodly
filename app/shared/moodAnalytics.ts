import { standardMoods } from "./moodType";

export type MoodAnalyticsLog = {
  id?: string;
  mood: number;
  note?: string | null;
  causes?: string[] | null;
  createdAt: string;
};

export type DailyMoodAverage = {
  date: string;
  averageMood: number;
  totalLogs: number;
};

export type MoodDistributionItem = {
  mood: number;
  count: number;
};

export type MoodNote = {
  id: string;
  date: string;
  mood: number;
  note: string;
  causes: string[];
  createdAt: string;
};

export type CauseSummary = {
  cause: string;
  totalCount: number;
  moodBreakdown: MoodDistributionItem[];
};

export type CauseAnalysis = Record<string, Record<string, number>>;

const standardMoodValues = standardMoods.map((mood) => mood.value);

export function roundOneDecimal(value: number) {
  return Number(value.toFixed(1));
}

export function getMoodLogDate(log: Pick<MoodAnalyticsLog, "createdAt">) {
  return log.createdAt.split("T")[0];
}

export function calculateAverageMood(logs: MoodAnalyticsLog[]) {
  if (logs.length === 0) return 0;

  const totalMood = logs.reduce((sum, log) => sum + Number(log.mood), 0);
  return roundOneDecimal(totalMood / logs.length);
}

export function calculateDailyMoodAverages(
  logs: MoodAnalyticsLog[],
  dateRange: string[],
): DailyMoodAverage[] {
  const dailyMoodMap: Record<string, { totalMood: number; totalLogs: number }> =
    {};

  logs.forEach((log) => {
    const date = getMoodLogDate(log);
    const mood = Number(log.mood);

    if (!dailyMoodMap[date]) {
      dailyMoodMap[date] = { totalMood: 0, totalLogs: 0 };
    }

    dailyMoodMap[date].totalMood += mood;
    dailyMoodMap[date].totalLogs += 1;
  });

  return dateRange.map((date) => {
    const value = dailyMoodMap[date];

    if (!value) {
      return {
        date,
        averageMood: 0,
        totalLogs: 0,
      };
    }

    return {
      date,
      averageMood: roundOneDecimal(value.totalMood / value.totalLogs),
      totalLogs: value.totalLogs,
    };
  });
}

export function calculateMoodDistributionRecord(logs: MoodAnalyticsLog[]) {
  return logs.reduce<Record<string, number>>((acc, log) => {
    const moodKey = String(log.mood);
    acc[moodKey] = (acc[moodKey] || 0) + 1;
    return acc;
  }, {});
}

export function calculateMoodDistribution(
  logs: MoodAnalyticsLog[],
  moodValues = standardMoodValues,
): MoodDistributionItem[] {
  const distributionMap = calculateMoodDistributionRecord(logs);

  return moodValues.map((mood) => ({
    mood,
    count: distributionMap[String(mood)] ?? 0,
  }));
}

export function calculateCauseAnalysis(logs: MoodAnalyticsLog[]) {
  const causesAnalysis: CauseAnalysis = {};

  logs.forEach((log) => {
    log.causes?.forEach((cause) => {
      if (!cause) return;

      const moodKey = String(log.mood);

      if (!causesAnalysis[cause]) {
        causesAnalysis[cause] = {};
      }

      causesAnalysis[cause][moodKey] =
        (causesAnalysis[cause][moodKey] || 0) + 1;
    });
  });

  return causesAnalysis;
}

export function calculateCauseSummaries(
  logs: MoodAnalyticsLog[],
  moodValues = standardMoodValues,
): CauseSummary[] {
  const causesAnalysis = calculateCauseAnalysis(logs);

  return Object.entries(causesAnalysis)
    .map(([cause, moodCounts]) => ({
      cause,
      totalCount: Object.values(moodCounts).reduce((sum, count) => sum + count, 0),
      moodBreakdown: moodValues.map((mood) => ({
        mood,
        count: moodCounts[String(mood)] ?? 0,
      })),
    }))
    .sort((firstCause, secondCause) => {
      return secondCause.totalCount - firstCause.totalCount;
    });
}

export function createMoodNotes(logs: MoodAnalyticsLog[]): MoodNote[] {
  return logs.map((log) => ({
    id: log.id ?? "",
    date: getMoodLogDate(log),
    mood: Number(log.mood),
    note: log.note ?? "",
    causes: log.causes ?? [],
    createdAt: log.createdAt,
  }));
}
