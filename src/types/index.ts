// Procrastination Fingerprint Types

export type EventKind = 'ACTIVE' | 'IDLE' | 'DISTRACTION';

export interface AttentionEvent {
  id: string;
  ts: number; // epoch ms
  domain: string; // '' if none
  title?: string;
  isIdle: boolean;
  kind: EventKind; // derived in dashboard (ACTIVE/DISTRACTION) or by extension for IDLE
}

export interface Settings {
  distractionDomains: string[];
  captureIntervalSec: number; // default 5
  focusInterceptEnabled: boolean;
  dailyStudyGoalMin: number; // default 240
}

export interface FingerprintBucket {
  hour: number; // 0..23
  dow: number; // 1..7 (Mon..Sun)
  score: number; // 0..100
  tabSwitchesPer5: number;
  minutesDistracted: number;
  topDomains: { domain: string; minutes: number }[];
}

export interface FocusSession {
  id: string;
  startTime: number;
  endTime?: number;
  durationMin: number;
  isActive: boolean;
  type: 'focus' | 'break';
}

export interface TimelineSegment {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  type: 'focus' | 'distraction' | 'idle' | 'active';
  score: number;
  domains: string[];
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  focusMinutes: number;
  distractionMinutes: number;
  idleMinutes: number;
  avgScore: number;
  topDistraction: string;
  focusStreakMin: number;
}

export interface NextBestWindow {
  hour: number;
  score: number;
  confidence: number;
  reason: string;
}