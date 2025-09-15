import { useState, useEffect } from 'react';
import { ProcrastinationHeatmap } from './ProcrastinationHeatmap';
import { FocusTimer } from './FocusTimer';
import { TodayTimeline } from './TodayTimeline';
import { TopTriggers } from './TopTriggers';
import { NextBestWindow } from './NextBestWindow';
import { SettingsPanel } from './SettingsPanel';
import { WeeklyStats } from './WeeklyStats';
import { generateDemoData, generateTodayTimeline, generateWeeklyStats, defaultSettings } from '@/lib/demo-data';
import type { Settings as AppSettings, FingerprintBucket, TimelineSegment, DayStats, NextBestWindow as NextBestWindowType } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const ProcrastinationDashboard = () => {
  const [buckets, setBuckets] = useState<FingerprintBucket[]>([]);
  const [timeline, setTimeline] = useState<TimelineSegment[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<DayStats[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isInFocusSession, setIsInFocusSession] = useState(false);
  const { toast } = useToast();

  // Initialize demo data
  useEffect(() => {
    const demoData = generateDemoData();
    setBuckets(demoData.buckets);
    setTimeline(generateTodayTimeline());
    setWeeklyStats(generateWeeklyStats());
  }, []);

  const handleFocusStart = () => {
    setIsInFocusSession(true);
    toast({
      title: 'Focus session started! 🎯',
      description: 'Stay focused and avoid distractions. You got this!',
    });
  };

  const handleFocusEnd = () => {
    setIsInFocusSession(false);
    toast({
      title: 'Great work! 🎉',
      description: 'Focus session completed. Take a well-deserved break.',
    });
  };

  const handleExportData = (format: 'json' | 'csv') => {
    const data = {
      buckets,
      timeline,
      weeklyStats,
      settings,
      exportDate: new Date().toISOString()
    };

    let content: string;
    let fileName: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      fileName = `procrastination-data-${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      // Convert to CSV (simplified)
      const csvRows = [
        ['Date', 'Hour', 'Day of Week', 'Procrastination Score', 'Tab Switches', 'Minutes Distracted'],
        ...buckets.map(bucket => [
          new Date().toISOString().split('T')[0], // Today's date for demo
          bucket.hour.toString(),
          bucket.dow.toString(),
          bucket.score.toString(),
          bucket.tabSwitchesPer5.toString(),
          bucket.minutesDistracted.toString()
        ])
      ];
      content = csvRows.map(row => row.join(',')).join('\n');
      fileName = `procrastination-data-${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }

    // Download the file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: `Data exported as ${format.toUpperCase()}`,
      description: `Downloaded ${fileName} to your computer`,
    });
  };

  // Generate top triggers from demo data
  const topTriggers = [
    { domain: 'youtube.com', minutes: 125, percentage: 35, trend: 'up' as const },
    { domain: 'reddit.com', minutes: 89, percentage: 25, trend: 'down' as const },
    { domain: 'instagram.com', minutes: 67, percentage: 19, trend: 'up' as const },
    { domain: 'twitter.com', minutes: 45, percentage: 13, trend: 'stable' as const },
    { domain: 'tiktok.com', minutes: 29, percentage: 8, trend: 'down' as const }
  ];

  // Generate next best window recommendation
  const nextBestWindow: NextBestWindowType = {
    hour: 16, // 4 PM
    score: 25,
    confidence: 85,
    reason: "Historical data shows low distraction rates at this time"
  };

  return (
    <div className="min-h-screen bg-gradient-surface p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Procrastination Fingerprint
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover your unique focus patterns, identify distraction triggers, and optimize your productivity with data-driven insights.
          </p>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Heatmap */}
          <div className="lg:col-span-2 space-y-6">
            <ProcrastinationHeatmap buckets={buckets} />
            
            {/* Today's timeline and weekly stats */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TodayTimeline segments={timeline} />
              <WeeklyStats stats={weeklyStats} />
            </div>
          </div>

          {/* Right column - Controls and insights */}
          <div className="space-y-6">
            <FocusTimer 
              onSessionStart={handleFocusStart}
              onSessionEnd={handleFocusEnd}
            />
            
            <NextBestWindow 
              recommendation={nextBestWindow}
              onStartFocus={handleFocusStart}
            />
            
            <TopTriggers triggers={topTriggers} />
          </div>
        </div>

        {/* Bottom section - Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              onExportData={handleExportData}
            />
          </div>
          
          {/* Extension setup guide */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 border border-primary/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🔧 Chrome Extension Setup
              </h3>
              <div className="space-y-4 text-sm">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">📋 This is a MVP Dashboard</p>
                  <p className="text-muted-foreground">
                    The dashboard shows demo data to demonstrate features. In the full version, 
                    a Chrome extension would capture your browsing data and sync with this dashboard.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">📊 What the extension would track:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Active tab domain every 5 seconds</li>
                      <li>• Tab switch frequency</li>
                      <li>• Idle time detection</li>
                      <li>• Focus session compliance</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">🎯 Smart features:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Gentle distraction warnings</li>
                      <li>• Focus window predictions</li>
                      <li>• Personalized insights</li>
                      <li>• Privacy-first local storage</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    🔒 <strong>Privacy:</strong> All data would stay on your device by default, 
                    with optional export for backup purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-sm text-muted-foreground">
          Built for university students who want to understand and improve their focus patterns • 
          <span className="mx-2">🎓</span> Privacy-first productivity
        </div>
      </div>
    </div>
  );
};