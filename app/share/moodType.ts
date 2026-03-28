export interface MoodType {
  value: number;
  emoji: string;
  label: string;
  color: MoodColor;
}
type MoodColor = "red" | "orange" | "yellow" | "green" | "cyan";

interface MoodStyle {
  border: string;
  bg: string;
  text: string;
  btn: string;
}

// type MoodStyles = Record<MoodColor, MoodStyle>;

// export const moodStyles: MoodStyles = {
//   red: {
//     border: "border-red-500",
//     bg: "bg-red-500/10",
//     text: "text-red-400",
//     btn: "from-red-500 to-red-400",
//   },
//   orange: {
//     border: "border-orange-500",
//     bg: "bg-orange-500/10",
//     text: "text-orange-400",
//     btn: "from-orange-500 to-orange-400",
//   },
//   yellow: {
//     border: "border-yellow-500",
//     bg: "bg-yellow-500/10",
//     text: "text-yellow-400",
//     btn: "from-yellow-500 to-yellow-400",
//   },
//   green: {
//     border: "border-green-500",
//     bg: "bg-green-500/10",
//     text: "text-green-400",
//     btn: "from-green-500 to-green-400",
//   },
//   cyan: {
//     border: "border-cyan-500",
//     bg: "bg-cyan-500/10",
//     text: "text-cyan-400",
//     btn: "from-cyan-500 to-cyan-400",
//   },
// };

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
