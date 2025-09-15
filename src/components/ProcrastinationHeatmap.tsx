import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { FingerprintBucket } from '@/types';
import { formatHour12 } from '@/shared/utils/format';

interface Props {
  buckets: FingerprintBucket[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getScoreColor = (score: number) => {
  if (score <= 30) return 'bg-score-low';
  if (score <= 60) return 'bg-score-medium';
  return 'bg-score-high';
};

const getScoreOpacity = (score: number) => {
  const opacity = Math.max(0.1, score / 100);
  return { opacity };
};

export const ProcrastinationHeatmap = ({ buckets }: Props) => {
  const [hoveredCell, setHoveredCell] = useState<{ hour: number; dow: number } | null>(null);
  
  const bucketIndex = useMemo(() => {
    const map = new Map<string, FingerprintBucket>();
    for (const b of buckets) {
      map.set(`${b.hour}-${b.dow}`, b);
    }
    return map;
  }, [buckets]);

  const getBucketData = (hour: number, dow: number) => bucketIndex.get(`${hour}-${dow}`);

  const formatHour = (hour: number) => formatHour12(hour);

  return (
    <TooltipProvider>
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Procrastination Fingerprint</h3>
          <p className="text-sm text-muted-foreground">
            Your distraction patterns by hour and day. Darker = more procrastination.
          </p>
        </div>
        
        <div className="space-y-3">
          {/* Day headers */}
          <div className="flex">
            <div className="w-12"></div>
            <div className="flex-1 grid grid-cols-7 gap-px md:gap-0.5 lg:gap-1">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="text-xs text-center text-muted-foreground"
                  style={{ fontSize: '10px' }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap matrix: 24 hour rows x 7 day columns */}
          {HOURS.map(hour => (
            <div key={hour} className="flex items-center">
              <div className="w-12 text-[10px] text-muted-foreground text-right pr-1">
                {hour % 4 === 0 ? formatHour(hour) : ''}
              </div>
              <div className="flex-1 grid grid-cols-7 gap-px md:gap-0.5 lg:gap-1">
                {DAYS.map((day, dayIndex) => {
                  const dow = dayIndex + 1;
                  const bucket = getBucketData(hour, dow);
                  const score = bucket?.score || 0;
                  const isHovered = hoveredCell?.hour === hour && hoveredCell?.dow === dow;

                  return (
                    <Tooltip key={`${hour}-${day}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-sm cursor-pointer transition-all duration-200 border
                            ${getScoreColor(score)}
                            ${isHovered ? 'border-primary scale-110 shadow-focus' : 'border-border'}
                          `}
                          style={getScoreOpacity(score)}
                          onMouseEnter={() => setHoveredCell({ hour, dow })}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {day} {formatHour(hour)}
                          </div>
                          <div className="text-sm">
                            Procrastination Score: <span className="font-medium">{Math.round(score)}</span>
                          </div>
                          {bucket && (
                            <>
                              <div className="text-sm">
                                Tab switches: {bucket.tabSwitchesPer5}/5min
                              </div>
                              <div className="text-sm">
                                Distracted: {bucket.minutesDistracted}min
                              </div>
                              {bucket.topDomains.length > 0 && (
                                <div className="text-sm">
                                  Top sites: {bucket.topDomains.slice(0, 2).map(d => d.domain).join(', ')}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-3 border-t">
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, i) => (
                  <div 
                    key={i}
                    className="w-3 h-3 rounded-sm bg-score-high"
                    style={{ opacity }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            <div className="text-xs">
              Lower scores = better focus
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};