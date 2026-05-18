import { OverViewEntity } from "../../domain/entity/OverViewEntity";
import { moodsLogModelResponse } from "../models/moodLogResponseModel";

export const overViewMapper = {
  toEntity(dto: moodsLogModelResponse): OverViewEntity {
    const data = dto.data;

    return {
      moodDateAvg: [],
      fromDate: data[data.length - 1].createdAt,
      todate: data[0].createdAt,
      totalDate: data.length,
    };
  },
};
