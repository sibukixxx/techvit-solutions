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

/** 90 → 「1時間30分」 / 45 → 「45分」 */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}
