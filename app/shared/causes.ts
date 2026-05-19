import type { CauseEntity } from "./entities/CauseEntity";
import { standardCauses } from "./moodType";

export type CauseOption = {
  name: string;
};

export function createCauseOptions(customCauses: Pick<CauseEntity, "name">[]) {
  return [
    ...standardCauses.map((cause) => ({ name: cause.label })),
    ...customCauses.map((cause) => ({ name: cause.name })),
  ];
}
