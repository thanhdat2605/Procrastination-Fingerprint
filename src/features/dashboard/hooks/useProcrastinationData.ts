import { useEffect, useMemo, useState } from "react";
import { generateDemoData, generateTodayTimeline, generateWeeklyStats } from "@/lib/demo-data";
import type { FingerprintBucket, TimelineSegment, DayStats } from "@/types";

export function useProcrastinationData() {
  const [buckets, setBuckets] = useState<FingerprintBucket[]>([]);
  const [timeline, setTimeline] = useState<TimelineSegment[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<DayStats[]>([]);

  useEffect(() => {
    const demo = generateDemoData();
    setBuckets(demo.buckets);
    setTimeline(generateTodayTimeline());
    setWeeklyStats(generateWeeklyStats());
  }, []);

  return useMemo(() => ({ buckets, timeline, weeklyStats }), [buckets, timeline, weeklyStats]);
}


