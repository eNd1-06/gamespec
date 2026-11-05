export type PrimarySource = { url: string; kind: "manufacturer-product" | "manufacturer-manual"; locator: string };
export type SpecEvidence<T extends number | string | boolean> = {
  value: T; unit: string; conditions: string | null;
} & (
  | { status: "unverified"; source: null; checkedOn: null }
  | { status: "verified"; source: PrimarySource; checkedOn: string }
  | { status: "needs-review"; source: PrimarySource | null; checkedOn: string | null; reason: string }
);
export type PriceObservation = { amount: number; currency: "JPY"; sourceUrl: string | null; fetchedAt: string | null };
