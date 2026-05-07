import {
  moodsModelResponse,
  moodsModelResponseResult,
} from "../models/moodsModel";

export class moodsEntity {
  data: moodsResultEntity[];
  total: number;
  page: number;
  constructor(entity: moodsModelResponse) {
    this.data = entity.data.map((item) => new moodsResultEntity(item));
    this.total = entity.total;
    this.page = entity.page;
  }
}
export class moodsResultEntity {
  id: string;
  userId: string;
  mood: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  causes: string[];
  constructor(data: moodsModelResponseResult) {
    this.id = data.id;
    this.userId = data.userId;
    this.mood = data.mood;
    this.note = data.note ?? "";
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.causes = data.causes;
  }
}
// class CauseEntity {
//   id: string;
//   moodLogId: string;
//   cause: string;
//   constructor(data: CauseModel) {
//     this.id = data.id;
//     this.moodLogId = data.moodLogId;
//     this.cause = data.cause;
//   }
// }
