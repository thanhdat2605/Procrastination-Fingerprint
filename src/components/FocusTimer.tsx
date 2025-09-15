import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Coffee, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFocusTimer } from '@/features/dashboard/hooks/useFocusTimer';
import { formatTimeHM } from '@/shared/utils/format';

interface Props {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export const FocusTimer = ({ onSessionStart, onSessionEnd }: Props) => {
  const { toast } = useToast();
  const { state, timeLeft, isBreak, sessionCount, start, pause, stop, progress } = useFocusTimer(
    () => {
      onSessionStart?.();
    },
    () => {
      toast({
        title: 'Focus session complete! 🎉',
        description: 'Time for a break.',
      });
      onSessionEnd?.();
    }
  );

  const getTimerColor = () => {
    if (state === 'break') return 'text-accent';
    if (state === 'focus') return 'text-focus';
    return 'text-foreground';
  };

  const progressValue = useMemo(() => progress, [progress]);

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          {isBreak ? (
            <>
              <Coffee className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Break Time</h3>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 text-focus" />
              <h3 className="text-lg font-semibold">Focus Session</h3>
            </>
          )}
        </div>

        {/* Circular progress */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={getTimerColor()}
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressValue / 100)}`}
              style={{ 
                transition: 'stroke-dashoffset 1s ease-in-out',
                filter: state === 'focus' ? 'drop-shadow(0 0 8px hsl(var(--focus) / 0.5))' : undefined
              }}
            />
          </svg>
          
          {/* Timer display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getTimerColor()}`}>
                {formatTimeHM(timeLeft)}
              </div>
              <div className="text-xs text-muted-foreground">
                {state === 'break' ? 'Break' : state === 'focus' ? 'Focus' : 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {state === 'idle' ? (
            <Button onClick={start} className="bg-gradient-focus">
              <Play className="w-4 h-4 mr-2" />
              Start Focus
            </Button>
          ) : (
            <>
              {state === 'paused' ? (
                <Button onClick={start} variant="secondary">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={pause} variant="secondary">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={stop} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Session count */}
        <div className="text-sm text-muted-foreground">
          Sessions completed: <span className="font-medium text-focus">{sessionCount}</span>
          {sessionCount > 0 && (
            <span className="ml-2">
              ({Math.floor(sessionCount * 25 / 60)}h {(sessionCount * 25) % 60}m total)
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};