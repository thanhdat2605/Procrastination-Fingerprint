import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DayStats } from '@/types';

interface Props {
  stats: DayStats[];
}

export const WeeklyStats = ({ stats }: Props) => {
  // Handle empty state safely
  if (!stats || stats.length === 0) {
    return (
      <Card className="p-6 min-h-[420px] flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Weekly Overview</h3>
          <p className="text-sm text-muted-foreground">
            No data yet. Start a focus session to begin tracking.
          </p>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </Card>
    );
  }

  const totalFocusMinutes = stats.reduce((sum, day) => sum + (day.focusMinutes || 0), 0);
  const totalDistractionMinutes = stats.reduce((sum, day) => sum + (day.distractionMinutes || 0), 0);
  const avgScore = stats.length ? stats.reduce((sum, day) => sum + (day.avgScore || 0), 0) / stats.length : 0;
  const longestStreak = Math.max(...stats.map(s => s.focusStreakMin || 0));
  
  // Calculate trends
  const recentArr = stats.slice(-3);
  const earlierArr = stats.slice(0, 3);
  const recentFocus = recentArr.reduce((sum, day) => sum + (day.focusMinutes || 0), 0) / (recentArr.length || 1);
  const earlierFocus = earlierArr.reduce((sum, day) => sum + (day.focusMinutes || 0), 0) / (earlierArr.length || 1);
  const focusTrend = recentFocus > earlierFocus ? 'up' : recentFocus < earlierFocus ? 'down' : 'stable';

  const worstDay = stats.reduce((worst, day) => (day.avgScore > worst.avgScore ? day : worst), stats[0]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-focus" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-distraction" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };
  return (
    <Card className="p-6 min-h-[420px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Weekly Overview</h3>
        <p className="text-sm text-muted-foreground">
          Your productivity trends over the last 7 days
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-focus-light rounded-lg">
          <div className="text-2xl font-bold text-focus">{formatTime(totalFocusMinutes)}</div>
          <div className="text-xs text-focus/80">Total Focus Time</div>
          <div className="flex items-center justify-center mt-1">
            {getTrendIcon(focusTrend)}
            <span className="text-xs ml-1">vs last week</span>
          </div>
        </div>
        
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{Math.round(avgScore)}</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
          <div className="text-xs mt-1">
            {avgScore <= 40 ? '🎯 Excellent' : avgScore <= 60 ? '👍 Good' : '⚠️ Needs work'}
          </div>
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="space-y-3 flex-1">
        <div className="text-sm font-medium">Daily Breakdown</div>
        {stats.map((day, index) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en', { weekday: 'short' });
          const isToday = index === stats.length - 1;
          const focusRate = (day.focusMinutes / day.totalMinutes) * 100 || 0;
          
          return (
            <div key={day.date} className={`flex items-center gap-3 p-2 rounded ${isToday ? 'bg-primary/5 border border-primary/20' : ''}`}>
              <div className="w-8 text-sm font-medium">
                {dayName}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Focus: {formatTime(day.focusMinutes)}</span>
                  <span>{Math.round(focusRate)}%</span>
                </div>
                <Progress value={focusRate} className="h-2" />
              </div>
              
              <div className="w-12 text-right">
                <Badge 
                  variant={day.avgScore <= 40 ? "default" : day.avgScore <= 60 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {Math.round(day.avgScore)}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional insights */}
      <div className="mt-4 pt-4 border-t space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Longest focus streak:</span>
          <span className="font-medium">{formatTime(longestStreak)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total distraction time:</span>
          <span className="font-medium text-distraction">{formatTime(totalDistractionMinutes)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Most problematic day:</span>
          <span className="font-medium">
            {new Date(worstDay.date).toLocaleDateString('en', { weekday: 'short' })}
          </span>
        </div>
      </div>
    </Card>
  );
};