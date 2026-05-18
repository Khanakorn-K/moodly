export type MoodLevel = Readonly<{
  value: number;
  label: string;
}>;

export const MOOD_LEVELS = [
  { value: 1, label: "แย่มาก" },
  { value: 2, label: "แย่" },
  { value: 3, label: "ปานกลาง" },
  { value: 4, label: "ดี" },
  { value: 5, label: "ดีมาก" },
] as const satisfies readonly MoodLevel[];

export function findMoodLevelByDistributionKey(key: string) {
  return MOOD_LEVELS.find(
    (moodLevel) =>
      moodLevel.label === key || moodLevel.value.toString() === key,
  );
}
