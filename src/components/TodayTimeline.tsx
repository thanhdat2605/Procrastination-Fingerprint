import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TimelineSegment } from '@/types';

interface Props {
  segments: TimelineSegment[];
}

const getSegmentColor = (type: TimelineSegment['type']) => {
  switch (type) {
    case 'focus': return 'bg-focus';
    case 'distraction': return 'bg-distraction';
    case 'idle': return 'bg-idle';
    default: return 'bg-muted';
  }
};

const getSegmentLabel = (type: TimelineSegment['type']) => {
  switch (type) {
    case 'focus': return 'Focus';
    case 'distraction': return 'Distracted';
    case 'idle': return 'Idle';
    default: return 'Active';
  }
};

const getTypeIcon = (type: TimelineSegment['type']) => {
  switch (type) {
    case 'focus': return '🧠';
    case 'distraction': return '😵‍💫';
    case 'idle': return '😴';
    default: return '💻';
  }
};

export const TodayTimeline = ({ segments }: Props) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Group segments by hour for better visualization
  const hourGroups: { [key: number]: TimelineSegment[] } = {};
  segments.forEach(segment => {
    if (!hourGroups[segment.startHour]) {
      hourGroups[segment.startHour] = [];
    }
    hourGroups[segment.startHour].push(segment);
  });
  
  const formatTime = (hour: number, minute: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateStats = () => {
    const stats = {
      focus: 0,
      distraction: 0,
      idle: 0,
      active: 0
    };
    
    segments.forEach(segment => {
      const duration = segment.endMinute - segment.startMinute;
      stats[segment.type] += duration;
    });
    
    return stats;
  };

  const stats = calculateStats();
  const totalMinutes = Object.values(stats).reduce((sum, val) => sum + val, 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Today's Activity</h3>
        <p className="text-sm text-muted-foreground">
          Your focus patterns throughout the day
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-focus">
            {Math.round((stats.focus / totalMinutes) * 100) || 0}%
          </div>
          <div className="text-xs text-muted-foreground">Focus Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-distraction">
            {Math.round((stats.distraction / totalMinutes) * 100) || 0}%
          </div>
          <div className="text-xs text-muted-foreground">Distracted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-idle">
            {Math.round((stats.idle / totalMinutes) * 100) || 0}%
          </div>
          <div className="text-xs text-muted-foreground">Idle</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {Math.round(totalMinutes / 60 * 10) / 10}h
          </div>
          <div className="text-xs text-muted-foreground">Total Active</div>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="space-y-3">
        {Object.entries(hourGroups)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([hourStr, hourSegments]) => {
            const hour = Number(hourStr);
            const isCurrentHour = hour === currentHour;
            
            return (
              <div key={hour} className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium text-muted-foreground">
                  {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                </div>
                
                <div className="flex-1 relative">
                  {/* Hour background */}
                  <div className="h-8 bg-muted rounded-lg relative overflow-hidden">
                    {/* Segments */}
                    {hourSegments.map((segment, segIndex) => {
                      const startPercent = (segment.startMinute / 60) * 100;
                      const widthPercent = ((segment.endMinute - segment.startMinute) / 60) * 100;
                      
                      return (
                        <div
                          key={segIndex}
                          className={`absolute top-0 h-full ${getSegmentColor(segment.type)} transition-all duration-300 hover:opacity-80 cursor-pointer`}
                          style={{
                            left: `${startPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          title={`${getSegmentLabel(segment.type)} - ${formatTime(segment.startHour, segment.startMinute)} to ${formatTime(segment.endHour, segment.endMinute)} (Score: ${Math.round(segment.score)})`}
                        />
                      );
                    })}
                    
                    {/* Current time indicator */}
                    {isCurrentHour && (
                      <div
                        className="absolute top-0 w-0.5 h-full bg-primary shadow-glow z-10"
                        style={{
                          left: `${(currentMinute / 60) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Hour summary */}
                <div className="w-20 flex justify-end">
                  {hourSegments.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {getTypeIcon(hourSegments[0].type)} {Math.round(hourSegments.reduce((sum, seg) => sum + seg.score, 0) / hourSegments.length)}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        
        {/* Legend */}
        <div className="flex items-center gap-4 pt-3 border-t text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-focus rounded"></div>
            <span>Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-distraction rounded"></div>
            <span>Distraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-idle rounded"></div>
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span>Active</span>
          </div>
        </div>
      </div>
    </Card>
  );
};