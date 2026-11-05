import type { PriceObservation, SpecEvidence } from "./types";

export type MouseSpec = "weight" | "pollingRate";
export const mouseEvidence: Record<string, Partial<Record<MouseSpec, SpecEvidence<number>>>> = {
  "logicool-g-pro-x-superlight-2": {
    weight: { value: 60, unit: "g", conditions: null, status: "unverified", source: null, checkedOn: null },
    pollingRate: { value: 2000, unit: "Hz", conditions: null, status: "unverified", source: null, checkedOn: null },
  },
};
export const priceObservations: Record<string, PriceObservation> = {
  "logicool-g-pro-x-superlight-2": { amount: 19800, currency: "JPY", sourceUrl: null, fetchedAt: null },
};
