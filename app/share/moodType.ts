export interface MoodType {
  value: number;
  emoji: string;
  label: string;
  color: MoodColor;
}
type MoodColor = "red" | "orange" | "yellow" | "green" | "cyan";

type CauseKey =
  | "WORK"
  | "STOCK"
  | "FRIEND"
  | "FAMILY"
  | "HEALTH"
  | "LOVE"
  | "OTHER";

export interface CauseType {
  key: CauseKey;
  label: string;
}

export const standartMoods: MoodType[] = [
  { value: 1, emoji: "😞", label: "แย่มาก", color: "red" },
  { value: 2, emoji: "😕", label: "แย่", color: "orange" },
  { value: 3, emoji: "😐", label: "ปานกลาง", color: "yellow" },
  { value: 4, emoji: "🙂", label: "ดี", color: "green" },
  { value: 5, emoji: "😄", label: "ดีมาก", color: "cyan" },
];
export const stadartCauses: CauseType[] = [
  { key: "WORK", label: "งาน" },
  { key: "STOCK", label: "การเงิน" },
  { key: "FRIEND", label: "เพื่อน" },
  { key: "FAMILY", label: "ครอบครัว" },
  { key: "HEALTH", label: "สุขภาพ" },
  { key: "LOVE", label: "ความรัก" },
  { key: "OTHER", label: "อื่นๆ" },
];
