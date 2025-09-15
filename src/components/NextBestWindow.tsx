import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Calendar, ArrowRight } from 'lucide-react';
import type { NextBestWindow as NextBestWindowType } from '@/types';
import { formatHour12 } from '@/shared/utils/format';

interface Props {
  recommendation: NextBestWindowType;
  onStartFocus?: () => void;
}

export const NextBestWindow = ({ recommendation, onStartFocus }: Props) => {
  const formatHour = (hour: number) => formatHour12(hour);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-focus bg-focus-light';
    if (confidence >= 60) return 'text-score-medium bg-amber-50';
    return 'text-score-high bg-distraction-light';
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-focus';
    if (score <= 60) return 'text-score-medium';
    return 'text-score-high';
  };

  const now = new Date();
  const currentHour = now.getHours();
  const hoursUntil = recommendation.hour - currentHour;
  const timeUntil = hoursUntil > 0 
    ? `in ${hoursUntil} hour${hoursUntil === 1 ? '' : 's'}`
    : hoursUntil === 0 
      ? 'right now'
      : `${Math.abs(hoursUntil)} hour${Math.abs(hoursUntil) === 1 ? '' : 's'} ago`;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Optimal Focus Window</h3>
        <p className="text-sm text-muted-foreground">
          AI-suggested best time for your next focus session
        </p>
      </div>

      <div className="space-y-4">
        {/* Main recommendation */}
        <div className="text-center p-4 bg-gradient-surface rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {formatHour(recommendation.hour)}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground mb-3">
            {timeUntil}
          </div>

          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="text-center">
              <div className={`text-lg font-bold ${getScoreColor(recommendation.score)}`}>
                {Math.round(recommendation.score)}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            
            <div className="w-px h-8 bg-border"></div>
            
            <div className="text-center">
              <Badge className={getConfidenceColor(recommendation.confidence)}>
                {Math.round(recommendation.confidence)}%
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">Confidence</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground italic">
            "{recommendation.reason}"
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {hoursUntil <= 0 && (
            <Button 
              onClick={onStartFocus}
              className="w-full bg-gradient-focus"
            >
              <Target className="w-4 h-4 mr-2" />
              Start Focus Session Now
            </Button>
          )}
          
          {hoursUntil > 0 && (
            <Button variant="secondary" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Set Reminder for {formatHour(recommendation.hour)}
            </Button>
          )}
          
          <Button variant="outline" className="w-full text-xs">
            <ArrowRight className="w-3 h-3 mr-2" />
            View Full Week Analysis
          </Button>
        </div>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-3 border-t">
          <div className="font-medium mb-2">💡 Pro Tips:</div>
          <div>• Close distracting tabs before starting</div>
          <div>• Use Do Not Disturb mode</div>
          <div>• Have water and snacks ready</div>
          {hoursUntil > 2 && <div>• Schedule prep time 10 minutes before</div>}
        </div>
      </div>
    </Card>
  );
};