import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Coffee, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type TimerState = 'idle' | 'focus' | 'break' | 'paused';

interface Props {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export const FocusTimer = ({ onSessionStart, onSessionEnd }: Props) => {
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const { toast } = useToast();

  const FOCUS_TIME = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60; // 5 minutes
  const LONG_BREAK = 15 * 60; // 15 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state === 'focus' || state === 'break') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state]);

  const handleTimerComplete = () => {
    if (state === 'focus') {
      setSessionCount(prev => prev + 1);
      const newCount = sessionCount + 1;
      const isLongBreak = newCount % 4 === 0;
      
      toast({
        title: 'Focus session complete! 🎉',
        description: `Time for a ${isLongBreak ? 'long' : 'short'} break.`,
      });
      
      setIsBreak(true);
      setTimeLeft(isLongBreak ? LONG_BREAK : SHORT_BREAK);
      setState('break');
      onSessionEnd?.();
    } else {
      toast({
        title: 'Break time over! 💪',
        description: 'Ready for another focus session?',
      });
      
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
      setState('idle');
    }
  };

  const startTimer = () => {
    if (state === 'idle') {
      setState('focus');
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
      onSessionStart?.();
    } else if (state === 'paused') {
      setState(isBreak ? 'break' : 'focus');
    }
  };

  const pauseTimer = () => {
    setState('paused');
  };

  const stopTimer = () => {
    setState('idle');
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
    if (state !== 'idle') {
      onSessionEnd?.();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (state === 'break') return 'text-accent';
    if (state === 'focus') return 'text-focus';
    return 'text-foreground';
  };

  const getProgressPercentage = () => {
    const total = isBreak 
      ? (sessionCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK)
      : FOCUS_TIME;
    return ((total - timeLeft) / total) * 100;
  };

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
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgressPercentage() / 100)}`}
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
                {formatTime(timeLeft)}
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
            <Button onClick={startTimer} className="bg-gradient-focus">
              <Play className="w-4 h-4 mr-2" />
              Start Focus
            </Button>
          ) : (
            <>
              {state === 'paused' ? (
                <Button onClick={startTimer} variant="secondary">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="secondary">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={stopTimer} variant="outline">
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