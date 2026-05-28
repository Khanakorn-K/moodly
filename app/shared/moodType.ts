export interface MoodType {
  value: number;
  emoji: string;
  label: string;
}

export interface CauseType {
  key: string;
  label: string;
}

export const standardMoods: MoodType[] = [
  { value: 1, emoji: "😞", label: "แย่มาก" },
  { value: 2, emoji: "😕", label: "แย่" },
  { value: 3, emoji: "😐", label: "ปานกลาง" },
  { value: 4, emoji: "🙂", label: "ดี" },
  { value: 5, emoji: "😄", label: "ดีมาก" },
];
export const standardCauses: CauseType[] = [
  { key: "WORK", label: "งาน" },
  { key: "STOCK", label: "การเงิน" },
  { key: "FRIEND", label: "เพื่อน" },
  { key: "FAMILY", label: "ครอบครัว" },
  { key: "HEALTH", label: "สุขภาพ" },
  { key: "LOVE", label: "ความรัก" },
  { key: "OTHER", label: "อื่นๆ" },
];
