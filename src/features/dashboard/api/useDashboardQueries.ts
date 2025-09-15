import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiJson } from '@/shared/api/client';
import type { FingerprintBucket, TimelineSegment, DayStats, NextBestWindow, Settings } from '@/types';
import { useDataSource } from '@/features/data-source/context/DataSourceContext';
import { generateDemoData, generateTodayTimeline, generateWeeklyStats } from '@/lib/demo-data';

export function useDashboardData() {
  const { mode } = useDataSource();
  const buckets = useQuery({
    queryKey: ['buckets', mode],
    queryFn: async () => {
      if (mode === 'demo') return generateDemoData().buckets as FingerprintBucket[];
      return apiGet<FingerprintBucket[]>('/api/stats/buckets');
    }
  });
  const timeline = useQuery({
    queryKey: ['timelineToday', mode],
    queryFn: async () => (mode === 'demo' ? generateTodayTimeline() : apiGet<TimelineSegment[]>('/api/stats/timeline/today'))
  });
  const weekly = useQuery({
    queryKey: ['weeklyStats', mode],
    queryFn: async () => (mode === 'demo' ? generateWeeklyStats() : apiGet<DayStats[]>('/api/stats/weekly'))
  });
  const triggers = useQuery({
    queryKey: ['topTriggers', mode],
    queryFn: async () => {
      if (mode === 'demo') {
        // simple derivation from buckets
        const bucketsData = generateDemoData().buckets;
        const map = new Map<string, number>();
        for (const b of bucketsData) for (const d of b.topDomains) map.set(d.domain, (map.get(d.domain)||0)+d.minutes);
        const arr = Array.from(map.entries()).map(([domain, minutes]) => ({ domain, minutes, percentage: 0, trend: 'stable' as const }));
        const total = arr.reduce((s,a)=>s+a.minutes,0);
        return arr.sort((a,b)=>b.minutes-a.minutes).slice(0,5).map(t=>({ ...t, percentage: total? Math.round((t.minutes/total)*100):0 }));
      }
      return apiGet<{domain:string;minutes:number;percentage:number;trend:'up'|'down'|'stable'}[]>('/api/stats/triggers/top');
    }
  });
  const nextWindow = useQuery({
    queryKey: ['nextBestWindow', mode],
    queryFn: async () => (mode === 'demo' ? { hour: 16, score: 25, confidence: 85, reason: 'Demo mode' } as NextBestWindow : apiGet<NextBestWindow>('/api/stats/recommendations/next-window'))
  });
  return { buckets, timeline, weekly, triggers, nextWindow };
}

export function useSettingsApi() {
  const qc = useQueryClient();
  const { mode } = useDataSource();
  const settings = useQuery({ queryKey: ['settings', mode], queryFn: () => apiGet<Settings>('/api/settings'), enabled: mode === 'api' });
  const update = useMutation({
    mutationFn: (next: Settings) => apiJson<{ ok: true }>('/api/settings', 'PUT', next),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] })
  });
  return { settings, update };
}

export function useFocusApi() {
  const { mode } = useDataSource();
  const start = useMutation({ mutationFn: () => mode === 'api' ? apiJson<{ ok: true }>('/api/focus/start', 'POST', {}) : Promise.resolve({ ok: true } as { ok: true }) });
  const end = useMutation({ mutationFn: () => mode === 'api' ? apiJson<{ ok: true }>('/api/focus/end', 'POST', {}) : Promise.resolve({ ok: true } as { ok: true }) });
  return { start, end };
}


