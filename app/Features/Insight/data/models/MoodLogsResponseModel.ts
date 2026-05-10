export interface MoodLogsResponseModel {
  data: MoodLogResponseModel[];
  total: number;
  page: number;
}

export interface MoodLogResponseModel {
  id: string;
  userId: string;
  mood: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  causes: string[];
}
