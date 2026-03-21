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
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  causes: Cause[];
}
interface Cause {
  id: string;
  moodLogId: string;
  cause: string;
}
