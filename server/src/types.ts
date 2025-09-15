export type EventKind = 'ACTIVE' | 'IDLE' | 'DISTRACTION';

export interface AttentionEvent {
  id: string;
  ts: number;
  domain: string;
  title?: string;
  isIdle: boolean;
  kind: EventKind;
}

export interface Settings {
  distractionDomains: string[];
  captureIntervalSec: number;
  focusInterceptEnabled: boolean;
  dailyStudyGoalMin: number;
}

export interface FocusSession {
  id: string;
  startTime: number;
  endTime?: number;
}

export interface FingerprintBucket {
  hour: number;
  dow: number;
  score: number;
  tabSwitchesPer5: number;
  minutesDistracted: number;
  topDomains: { domain: string; minutes: number }[];
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
  date: string;
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


