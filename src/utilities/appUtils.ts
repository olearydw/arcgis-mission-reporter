import { v4 as uuidv4 } from "uuid";

import cloneDeep from "lodash/cloneDeep";

/**
 * Method generates a unique identifier following uuid v4 specs
 */
export function getUuid() {
  return uuidv4();
}

export function addValues(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * Method creates a deep clone on a provided object
 */
export function getClone(): unknown {
  const teamInfo = {
    id: "12345",
    group: "Tysons Dev Center",
    projects: [
      "excalibur",
      "mission",
      "motion imagery",
      "all source",
      "national imagery"
    ],
    address: {
      street: "Westwood Center Drive",
      city: "Vienna",
      state: "VA",
      zip: "22554"
    }
  };
  return cloneDeep(teamInfo);
}

export function clone(source: object): object {
  if (!source) {
    return {};
  }
  return cloneDeep(source);
}
