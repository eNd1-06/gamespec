import type { PriceObservation, SpecEvidence } from "../data/spec-evidence/types";

function validDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  const todayJst = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date && date <= todayJst;
}
function validUrl(url: string): boolean {
  try { return ["http:", "https:"].includes(new URL(url).protocol); } catch { return false; }
}
export function specState(value: number | null | undefined, unit: string, evidence?: SpecEvidence<number>) {
  if (value == null) return { status: "missing" as const, text: "未登録" };
  if (!evidence) return { status: "unverified" as const, text: "既存登録値・出典未確認／条件未確認" };
  if (evidence.value !== value || evidence.unit !== unit) return { status: "needs-review" as const, text: "要再確認：登録値または単位が台帳と不一致" };
  if (evidence.status === "needs-review") return { status: "needs-review" as const, text: `要再確認：${evidence.reason}` };
  if (evidence.status === "verified") {
    if (!evidence.conditions?.trim() || !evidence.source.locator.trim() || !validUrl(evidence.source.url) || !validDate(evidence.checkedOn))
      return { status: "needs-review" as const, text: "要再確認：出典・条件または確認日が不足" };
    return { status: "verified" as const, text: `メーカー記載確認済み・確認日 ${evidence.checkedOn}／${evidence.conditions}`, source: evidence.source };
  }
  return { status: "unverified" as const, text: "既存登録値・出典未確認／条件未確認" };
}
export function priceNote(amount: number, observation?: PriceObservation): string {
  if (!observation || observation.amount !== amount || !observation.fetchedAt || !observation.sourceUrl || !validUrl(observation.sourceUrl) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(observation.fetchedAt) || Number.isNaN(Date.parse(observation.fetchedAt))) return "参考価格／取得日不明";
  return `参考価格／取得日時 ${observation.fetchedAt}（現在価格・在庫を保証しません）`;
}
