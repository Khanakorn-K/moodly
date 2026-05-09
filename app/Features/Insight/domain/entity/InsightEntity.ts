export interface MoodsResultEntity {
  id: string;
  userId: string;
  mood: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  causes: string[];
}

export interface InsightEntity {
  data: MoodsResultEntity[];
  total: number;
  page: number;
}
