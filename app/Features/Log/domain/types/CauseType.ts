


interface CauseType {
  key: CauseKey;
  label: string;
}

type CauseKey =
  | "WORK"
  | "STOCK"
  | "FRIEND"
  | "FAMILY"
  | "HEALTH"
  | "LOVE"
  | "OTHER";
