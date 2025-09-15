import { useCallback } from 'react';
import { ProcrastinationHeatmap } from './ProcrastinationHeatmap';
import { FocusTimer } from './FocusTimer';
import { TodayTimeline } from './TodayTimeline';
import { TopTriggers } from './TopTriggers';
import { NextBestWindow } from './NextBestWindow';
import { SettingsPanel } from './SettingsPanel';
import { WeeklyStats } from './WeeklyStats';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '@/features/dashboard/api/useDashboardQueries';
import { exportDashboardData } from '@/features/dashboard/services/exportData';
import { useSettings } from '@/features/settings/hooks/useSettings';

export const ProcrastinationDashboard = () => {
  const { buckets, timeline, weekly, triggers, nextWindow } = useDashboardData();
  const { settings } = useSettings();
  const { toast } = useToast();

  const handleFocusStart = useCallback(() => {
    toast({
      title: 'Focus session started! 🎯',
      description: 'Stay focused and avoid distractions. You got this!',
    });
  }, [toast]);

  const handleFocusEnd = useCallback(() => {
    toast({
      title: 'Great work! 🎉',
      description: 'Focus session completed. Take a well-deserved break.',
    });
  }, [toast]);

  const handleExportData = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') {
      const data = {
        buckets: buckets.data || [],
        timeline: timeline.data || [],
        weeklyStats: weekly.data || [],
        settings,
        exportDate: new Date().toISOString()
      };
      exportDashboardData(data, 'json', 'procrastination-data');
    } else {
      const rows = (buckets.data || []).map((bucket) => ({
        date: new Date().toISOString().split('T')[0],
        hour: bucket.hour,
        dow: bucket.dow,
        score: bucket.score,
        tabSwitchesPer5: bucket.tabSwitchesPer5,
        minutesDistracted: bucket.minutesDistracted,
      }));
      exportDashboardData(rows, 'csv', 'procrastination-data');
    }
    toast({
      title: `Data exported as ${format.toUpperCase()}`,
      description: `Downloaded procrastination-data to your computer`,
    });
  }, [buckets.data, timeline.data, weekly.data, settings, toast]);

  const topTriggers = triggers.data || [];

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
            <ProcrastinationHeatmap buckets={buckets.data || []} />
            
            {/* Today's timeline and weekly stats */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TodayTimeline segments={timeline.data || []} />
              <WeeklyStats stats={weekly.data || []} />
            </div>
          </div>

          {/* Right column - Controls and insights */}
          <div className="space-y-6">
            <FocusTimer 
              onSessionStart={handleFocusStart}
              onSessionEnd={handleFocusEnd}
            />
            
            <NextBestWindow 
              recommendation={nextWindow.data || { hour: 16, score: 25, confidence: 85, reason: '—' }}
              onStartFocus={handleFocusStart}
            />
            
            <TopTriggers triggers={topTriggers} />
          </div>
        </div>

        {/* Bottom section - Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SettingsPanel onExportData={handleExportData} />
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