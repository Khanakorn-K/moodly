export interface MoodLogPageEntity {
  items: MoodLogEntity[];
  total: number;
  page: number;
}
export interface MoodLogEntity {
  id: string;
  userId: string;
  mood: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  causes: string[];
}
