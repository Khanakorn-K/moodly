export interface moodsModelResponse {
  data: moodsModelResponseResult[];
  total: number;
  page: number;
}
export interface moodsModelResponseResult {
  id: string;
  userId: string;
  mood: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  causes: CauseModel[];
}
export interface CauseModel {
  id: string;
  moodLogId: string;
  cause: string;
}
