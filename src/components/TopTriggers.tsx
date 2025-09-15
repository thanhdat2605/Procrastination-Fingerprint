import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, TrendingUp } from 'lucide-react';

interface TriggerData {
  domain: string;
  minutes: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface Props {
  triggers: TriggerData[];
}

const getDomainIcon = (domain: string) => {
  if (domain.includes('youtube')) return '📺';
  if (domain.includes('tiktok')) return '🎵';
  if (domain.includes('facebook') || domain.includes('instagram')) return '📱';
  if (domain.includes('twitter')) return '🐦';
  if (domain.includes('reddit')) return '🤖';
  if (domain.includes('netflix')) return '🎬';
  if (domain.includes('steam')) return '🎮';
  return '🌐';
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up': return 'text-distraction';
    case 'down': return 'text-focus';
    default: return 'text-muted-foreground';
  }
};

export const TopTriggers = ({ triggers }: Props) => {
  const totalMinutes = triggers.reduce((sum, trigger) => sum + trigger.minutes, 0);
  const maxMinutes = Math.max(...triggers.map(t => t.minutes));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Top Distraction Triggers</h3>
        <p className="text-sm text-muted-foreground">
          Your biggest time sinks this week
        </p>
      </div>

      <div className="space-y-4">
        {triggers.slice(0, 5).map((trigger, index) => (
          <div key={trigger.domain} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">{getDomainIcon(trigger.domain)}</span>
                  <div>
                    <div className="font-medium">{trigger.domain}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(trigger.minutes)} minutes • {Math.round(trigger.percentage)}%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp 
                  className={`w-4 h-4 ${getTrendColor(trigger.trend)} ${
                    trigger.trend === 'down' ? 'rotate-180' : ''
                  }`}
                />
                <Badge variant="secondary">
                  {trigger.trend === 'up' ? '+' : trigger.trend === 'down' ? '-' : '='}{Math.round(Math.random() * 15 + 5)}%
                </Badge>
              </div>
            </div>
            
            <Progress 
              value={(trigger.minutes / maxMinutes) * 100} 
              className="h-2"
            />
          </div>
        ))}

        {triggers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-sm">No major distractions this week!</div>
            <div className="text-xs mt-1">Keep up the great work</div>
          </div>
        )}

        {totalMinutes > 0 && (
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Total distraction time:</span>
              <span className="font-medium">
                {Math.round(totalMinutes / 60 * 10) / 10}h this week
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Daily average:</span>
              <span className="font-medium">
                {Math.round(totalMinutes / 7)} min/day
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};