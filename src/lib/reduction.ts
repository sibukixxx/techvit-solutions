import type { Locale } from "./i18n";

export type Step = {
  step: string;
  minutes: number;
};

export function totalMinutes(steps: Step[]): number {
  return steps.reduce((sum, s) => sum + s.minutes, 0);
}

export function savedMinutes(before: Step[], after: Step[]): number {
  return totalMinutes(before) - totalMinutes(after);
}

export function reductionRate(before: Step[], after: Step[]): number {
  const b = totalMinutes(before);
  if (b === 0) return 0;
  return Math.round((savedMinutes(before, after) / b) * 100);
}

/** 90 → 「1時間30分」/ "1h 30m"、45 → 「45分」/ "45m" */
export function formatMinutes(minutes: number, locale: Locale = "ja"): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (locale === "en") {
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}
