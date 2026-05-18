export interface moodsLogModelResponse {
  data: moodsLogResponseModel[];
  total: number;
  page: number;
}
export interface moodsLogResponseModel {
  id: string;
  userId: string;
  mood: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  causes: string[];
}
