import type { AttentionEvent, FocusSession, Settings } from './types';

export const events: AttentionEvent[] = [];
export const focusSessions: FocusSession[] = [];
export let settings: Settings = {
  distractionDomains: [
    'youtube.com',
    'tiktok.com',
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'reddit.com',
    'netflix.com',
    'steamcommunity.com'
  ],
  captureIntervalSec: 5,
  focusInterceptEnabled: true,
  dailyStudyGoalMin: 240
};

export function replaceSettings(next: Settings) {
  settings = next;
}


