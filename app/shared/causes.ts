import type { CauseEntity } from "./entities/CauseEntity";
import { stadartCauses } from "./moodType";

export type CauseOption = {
  name: string;
};

export function createCauseOptions(customCauses: Pick<CauseEntity, "name">[]) {
  return [
    ...stadartCauses.map((cause) => ({ name: cause.label })),
    ...customCauses.map((cause) => ({ name: cause.name })),
  ];
}
