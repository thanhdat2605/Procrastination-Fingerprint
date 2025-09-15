import type { AttentionEvent, DayStats, FingerprintBucket, NextBestWindow, TimelineSegment } from '../types';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function computeBuckets(events: AttentionEvent[]): FingerprintBucket[] {
  const map = new Map<string, FingerprintBucket>();
  for (const ev of events) {
    const d = new Date(ev.ts);
    const hour = d.getHours();
    const dow = ((d.getDay() + 6) % 7) + 1;
    const key = `${hour}-${dow}`;
    const bucket = map.get(key) || { hour, dow, score: 0, tabSwitchesPer5: 0, minutesDistracted: 0, topDomains: [] };
    bucket.score += ev.kind === 'DISTRACTION' ? 2 : ev.kind === 'IDLE' ? 1 : 0.5;
    if (ev.kind === 'DISTRACTION') {
      bucket.minutesDistracted += 1;
      const top = bucket.topDomains.find(t => t.domain === ev.domain);
      if (top) top.minutes += 1; else bucket.topDomains.push({ domain: ev.domain, minutes: 1 });
    }
    map.set(key, bucket);
  }
  const buckets = Array.from(map.values()).map(b => ({
    ...b,
    score: Math.max(0, Math.min(100, Math.round(b.score))),
    tabSwitchesPer5: Math.round(b.score / 10) + 2,
    topDomains: b.topDomains.sort((a,b) => b.minutes - a.minutes).slice(0,3)
  }));
  const filled: FingerprintBucket[] = [];
  for (const h of HOURS) {
    for (let dow = 1; dow <= 7; dow++) {
      const cur = buckets.find(b => b.hour === h && b.dow === dow);
      filled.push(cur || { hour: h, dow, score: 0, tabSwitchesPer5: 0, minutesDistracted: 0, topDomains: [] });
    }
  }
  return filled;
}

export function computeTodayTimeline(events: AttentionEvent[]): TimelineSegment[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  const todays = events.filter(e => e.ts >= start);
  const segments: TimelineSegment[] = [];
  for (const hour of HOURS) {
    const hourEvents = todays.filter(e => new Date(e.ts).getHours() === hour);
    if (hourEvents.length === 0) continue;
    const slots = Math.min(4, Math.max(1, Math.round(hourEvents.length / 10)));
    const minutesPer = Math.floor(60 / slots);
    for (let i = 0; i < slots; i++) {
      const slice = hourEvents.slice(Math.floor((i / slots) * hourEvents.length), Math.floor(((i + 1) / slots) * hourEvents.length));
      const distr = slice.filter(e => e.kind === 'DISTRACTION').length;
      const idle = slice.filter(e => e.kind === 'IDLE').length;
      let type: TimelineSegment['type'] = 'active';
      if (idle > distr && idle > 0) type = 'idle';
      else if (distr > 0) type = 'distraction';
      else if (distr === 0 && idle === 0) type = 'focus';
      const score = type === 'focus' ? 20 : type === 'idle' ? 30 : type === 'distraction' ? 70 : 40;
      segments.push({
        startHour: hour,
        startMinute: i * minutesPer,
        endHour: hour,
        endMinute: Math.min(60, (i + 1) * minutesPer),
        type,
        score,
        domains: Array.from(new Set(slice.map(e => e.domain))).slice(0, 3)
      });
    }
  }
  return segments;
}

export function computeWeeklyStats(events: AttentionEvent[]): DayStats[] {
  const stats: DayStats[] = [];
  const now = new Date();
  const start7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0).getTime();
  const last7 = events.filter(e => e.ts >= start7);
  for (let d = 6; d >= 0; d--) {
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d, 0, 0, 0).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayEvents = last7.filter(e => e.ts >= dayStart && e.ts < dayEnd);
    const total = dayEvents.length;
    const focus = dayEvents.filter(e => e.kind === 'ACTIVE').length;
    const distr = dayEvents.filter(e => e.kind === 'DISTRACTION').length;
    const idle = dayEvents.filter(e => e.kind === 'IDLE').length;
    const date = new Date(dayStart).toISOString().split('T')[0];
    stats.push({
      date,
      totalMinutes: total,
      focusMinutes: focus,
      distractionMinutes: distr,
      idleMinutes: idle,
      avgScore: Math.round((distr / Math.max(1,total)) * 100),
      topDistraction: topDomain(dayEvents) || '—',
      focusStreakMin: Math.round((focus / Math.max(1,total)) * 120)
    });
  }
  return stats;
}

function topDomain(events: AttentionEvent[]): string | undefined {
  const count = new Map<string, number>();
  for (const e of events) {
    if (e.kind !== 'DISTRACTION') continue;
    count.set(e.domain, (count.get(e.domain) || 0) + 1);
  }
  return Array.from(count.entries()).sort((a,b) => b[1] - a[1])[0]?.[0];
}

export function computeTopTriggers(events: AttentionEvent[]) {
  const count = new Map<string, number>();
  for (const e of events) {
    if (e.kind !== 'DISTRACTION') continue;
    count.set(e.domain, (count.get(e.domain) || 0) + 1);
  }
  const arr = Array.from(count.entries()).map(([domain, minutes]) => ({
    domain, minutes, percentage: 0, trend: 'stable' as const
  }));
  const total = arr.reduce((s,a) => s + a.minutes, 0);
  return arr.sort((a,b) => b.minutes - a.minutes).slice(0, 5).map(t => ({
    ...t,
    percentage: total ? Math.round((t.minutes / total) * 100) : 0,
    trend: 'stable' as const
  }));
}

export function computeNextBestWindow(events: AttentionEvent[]): NextBestWindow {
  const byHour = new Map<number, { distr: number; total: number }>();
  for (let h = 0; h < 24; h++) byHour.set(h, { distr: 0, total: 0 });
  for (const e of events) {
    const h = new Date(e.ts).getHours();
    const v = byHour.get(h)!;
    v.total += 1;
    if (e.kind === 'DISTRACTION') v.distr += 1;
  }
  let bestHour = 9;
  let bestRate = Infinity;
  byHour.forEach((v, h) => {
    const rate = v.total ? v.distr / v.total : 1;
    if (rate < bestRate) { bestRate = rate; bestHour = h; }
  });
  return {
    hour: bestHour,
    score: Math.round(bestRate * 100),
    confidence: Math.round((1 - bestRate) * 100),
    reason: 'Picked hour with the lowest distraction ratio over last 7 days'
  };
}


