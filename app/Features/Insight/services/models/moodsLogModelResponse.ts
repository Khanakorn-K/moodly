export interface moodsLogModelResponse {
  data: moodsLogModelResponseResult[];
  total: number;
  page: number;
}
export interface moodsLogModelResponseResult {
  id: string;
  userId: string;
  mood: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  causes: string[];
}
// export interface CauseModel {
//   id: string;
//   moodLogId: string;
//   cause: string;
// }
