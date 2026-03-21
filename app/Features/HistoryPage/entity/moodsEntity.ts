import {
  moodsModelResponse,
  moodsModelResponseResult,
} from "../models/moodsModel";

export class moodsEntity {
  data: moodsModelResponseResult[];
  total: number;
  page: number;
  constructor(entity: moodsModelResponse) {
    this.data = entity.data ?? "";
    this.total = entity.total ?? 0;
    this.page = entity.page ?? 1;
  }
}
