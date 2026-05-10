import { InsightEntity } from "../../domain/entity/InsightEntity";
import { moodsLogModelResponse } from "../models/moodsLogResponseModel";

export const InsightMapper = {
  toEntity: (dto: moodsLogModelResponse): InsightEntity => {
    return {
      data: dto.data,
      total: dto.total,
      page: dto.page,
    };
  },
};
