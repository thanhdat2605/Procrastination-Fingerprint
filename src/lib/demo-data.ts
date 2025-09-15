import type { AttentionEvent, FingerprintBucket, TimelineSegment, DayStats, Settings } from '@/types';

// Generate realistic demo data for the last 7 days
export const generateDemoData = () => {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  const events: AttentionEvent[] = [];
  const buckets: FingerprintBucket[] = [];
  
  const distractionDomains = [
    'youtube.com',
    'tiktok.com',
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'reddit.com',
    'netflix.com',
    'steamcommunity.com'
  ];
  
  const studyDomains = [
    'coursera.org',
    'khanacademy.org',
    'docs.google.com',
    'notion.so',
    'github.com',
    'stackoverflow.com',
    'scholar.google.com',
    'library.university.edu'
  ];
  
  // Generate events for last 7 days
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const dayStart = now - (dayOffset * msPerDay);
    const date = new Date(dayStart);
    const dow = ((date.getDay() + 6) % 7) + 1; // Monday = 1, Sunday = 7
    
    // Simulate realistic daily patterns
    for (let hour = 8; hour < 24; hour++) {
      const isWeekend = dow >= 6;
      const isPeakHour = hour >= 14 && hour <= 18; // 2-6 PM peak distraction
      const isEveningChill = hour >= 20; // Evening relaxation
      const isMorningFocus = hour >= 9 && hour <= 11; // Morning focus time
      
      let baseScore = 30;
      if (isPeakHour) baseScore += 25;
      if (isEveningChill) baseScore += 15;
      if (isMorningFocus) baseScore -= 15;
      if (isWeekend) baseScore += 10;
      
      // Add some randomness
      const score = Math.max(0, Math.min(100, baseScore + (Math.random() - 0.5) * 30));
      
      // Generate bucket data
      const bucket: FingerprintBucket = {
        hour,
        dow,
        score,
        tabSwitchesPer5: Math.round(2 + (score / 100) * 8),
        minutesDistracted: Math.round((score / 100) * 45),
        topDomains: []
      };
      
      // Generate top domains for this bucket
      const numDomains = Math.min(3, Math.round(1 + (score / 100) * 2));
      const domains = score > 50 ? distractionDomains : studyDomains;
      for (let i = 0; i < numDomains; i++) {
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const minutes = Math.round(5 + Math.random() * 15);
        if (!bucket.topDomains.find(d => d.domain === domain)) {
          bucket.topDomains.push({ domain, minutes });
        }
      }
      bucket.topDomains.sort((a, b) => b.minutes - a.minutes);
      
      buckets.push(bucket);
      
      // Generate individual events for this hour
      const eventsThisHour = Math.round(6 + Math.random() * 6); // 6-12 events per hour
      for (let i = 0; i < eventsThisHour; i++) {
        const minute = Math.floor(Math.random() * 60);
        const ts = dayStart + (hour * 60 + minute) * 60 * 1000;
        
        const isDistraction = Math.random() < (score / 100) * 0.7;
        const domain = isDistraction 
          ? distractionDomains[Math.floor(Math.random() * distractionDomains.length)]
          : studyDomains[Math.floor(Math.random() * studyDomains.length)];
        
        const event: AttentionEvent = {
          id: `event_${ts}_${Math.random()}`,
          ts,
          domain,
          title: `${domain} - Sample Page`,
          isIdle: Math.random() < 0.1, // 10% idle time
          kind: isDistraction ? 'DISTRACTION' : 'ACTIVE'
        };
        
        events.push(event);
      }
    }
  }
  
  return { events, buckets };
};

export const generateTodayTimeline = (): TimelineSegment[] => {
  const segments: TimelineSegment[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  // Generate timeline for today up to current hour
  for (let hour = 8; hour <= Math.min(currentHour, 23); hour++) {
    const numSegments = Math.round(1 + Math.random() * 3); // 1-4 segments per hour
    const minutesPerSegment = 60 / numSegments;
    
    for (let seg = 0; seg < numSegments; seg++) {
      const startMinute = Math.floor(seg * minutesPerSegment);
      const endMinute = Math.floor((seg + 1) * minutesPerSegment);
      
      // Determine segment type based on time patterns
      const isDistraction = Math.random() < (hour >= 14 && hour <= 18 ? 0.4 : 0.2);
      const isIdle = Math.random() < 0.1;
      
      let type: TimelineSegment['type'] = 'active';
      let score = 20 + Math.random() * 30;
      
      if (isIdle) {
        type = 'idle';
        score = 10 + Math.random() * 20;
      } else if (isDistraction) {
        type = 'distraction';
        score = 60 + Math.random() * 30;
      } else if (hour >= 9 && hour <= 11) {
        type = 'focus';
        score = 10 + Math.random() * 20;
      }
      
      segments.push({
        startHour: hour,
        startMinute,
        endHour: hour,
        endMinute,
        type,
        score,
        domains: type === 'distraction' ? ['youtube.com', 'reddit.com'] : ['docs.google.com']
      });
    }
  }
  
  return segments;
};

export const generateWeeklyStats = (): DayStats[] => {
  const stats: DayStats[] = [];
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const dayStart = now - (dayOffset * msPerDay);
    const date = new Date(dayStart).toISOString().split('T')[0];
    
    const totalMinutes = 8 * 60 + Math.random() * 4 * 60; // 8-12 hours online
    const distractionRate = 0.2 + Math.random() * 0.3; // 20-50% distraction
    const distractionMinutes = totalMinutes * distractionRate;
    const focusMinutes = totalMinutes * (0.4 + Math.random() * 0.3);
    const idleMinutes = totalMinutes - distractionMinutes - focusMinutes;
    
    stats.push({
      date,
      totalMinutes,
      focusMinutes,
      distractionMinutes,
      idleMinutes,
      avgScore: Math.round(30 + distractionRate * 50),
      topDistraction: ['youtube.com', 'reddit.com', 'twitter.com'][Math.floor(Math.random() * 3)],
      focusStreakMin: Math.round(20 + Math.random() * 60)
    });
  }
  
  return stats;
};

export const defaultSettings: Settings = {
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