export function formatHour12(hour: number) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function formatTimeHM(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutesHuman(mins: number) {
  const hours = Math.floor(mins / 60);
  const rem = Math.round(mins % 60);
  return hours > 0 ? `${hours}h ${rem}m` : `${rem}m`;
}

export function percent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}


