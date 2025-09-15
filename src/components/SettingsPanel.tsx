import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Upload, X, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useSettingsApi } from '@/features/dashboard/api/useDashboardQueries';
import { useDataSource } from '@/features/data-source/context/DataSourceContext';

interface Props {
  onExportData: (format: 'json' | 'csv') => void;
}

export const SettingsPanel = ({ onExportData }: Props) => {
  const [newDomain, setNewDomain] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { settings, setSettings } = useSettings();
  const { update } = useSettingsApi();
  const { mode, toggle } = useDataSource();

  const handleAddDomain = () => {
    if (newDomain.trim() && !settings.distractionDomains.includes(newDomain.trim())) {
      setSettings({
        ...settings,
        distractionDomains: [...settings.distractionDomains, newDomain.trim()]
      });
      setNewDomain('');
      update.mutate({ ...settings, distractionDomains: [...settings.distractionDomains, newDomain.trim()] });
      toast({
        title: 'Domain added',
        description: `${newDomain.trim()} added to distraction list`,
      });
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setSettings({
      ...settings,
      distractionDomains: settings.distractionDomains.filter(d => d !== domain)
    });
    update.mutate({ ...settings, distractionDomains: settings.distractionDomains.filter(d => d !== domain) });
    toast({
      title: 'Domain removed',
      description: `${domain} removed from distraction list`,
    });
  };

  const handleStudyGoalChange = (value: string) => {
    const minutes = parseInt(value) || 240;
    setSettings({
      ...settings,
      dailyStudyGoalMin: Math.max(60, Math.min(600, minutes)) // 1-10 hours
    });
    update.mutate({ ...settings, dailyStudyGoalMin: Math.max(60, Math.min(600, minutes)) });
  };

  const handleIntervalChange = (value: string) => {
    const interval = parseInt(value) || 5;
    setSettings({
      ...settings,
      captureIntervalSec: Math.max(1, Math.min(60, interval)) // 1-60 seconds
    });
    update.mutate({ ...settings, captureIntervalSec: Math.max(1, Math.min(60, interval)) });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Settings & Data</h3>
      </div>

      <div className="space-y-6">
        {/* Data Source */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Data Source</Label>
            <div className="text-xs text-muted-foreground">
              Toggle between API and Demo data
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>Demo</span>
            <Switch
              checked={mode === 'api'}
              onCheckedChange={() => toggle()}
            />
            <span>API</span>
          </div>
        </div>

        {/* Study Goal */}
        <div className="space-y-2">
          <Label htmlFor="studyGoal">Daily Study Goal (minutes)</Label>
          <Input
            id="studyGoal"
            type="number"
            value={settings.dailyStudyGoalMin}
            onChange={(e) => handleStudyGoalChange(e.target.value)}
            min={60}
            max={600}
          />
          <div className="text-xs text-muted-foreground">
            Currently: {Math.round(settings.dailyStudyGoalMin / 60 * 10) / 10} hours per day
          </div>
        </div>

        {/* Focus Intercept */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Focus Session Intercepts</Label>
            <div className="text-xs text-muted-foreground">
              Show warnings when visiting distracting sites during focus
            </div>
          </div>
          <Switch
            checked={settings.focusInterceptEnabled}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, focusInterceptEnabled: checked })
            }
          />
        </div>

        <Separator />

        {/* Distraction Domains */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Distraction Domains</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.distractionDomains.map((domain) => (
              <Badge key={domain} variant="secondary" className="gap-1">
                {domain}
                {isEditing && (
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveDomain(domain)}
                  />
                )}
              </Badge>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add domain (e.g., youtube.com)"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
              />
              <Button onClick={handleAddDomain} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Capture Interval */}
        <div className="space-y-2">
          <Label htmlFor="interval">Data Capture Interval (seconds)</Label>
          <Input
            id="interval"
            type="number"
            value={settings.captureIntervalSec}
            onChange={(e) => handleIntervalChange(e.target.value)}
            min={1}
            max={60}
          />
          <div className="text-xs text-muted-foreground">
            How often the extension captures your activity
          </div>
        </div>

        <Separator />

        {/* Data Export */}
        <div className="space-y-3">
          <Label>Export Data</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => onExportData('json')}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-2" />
              JSON
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onExportData('csv')}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-2" />
              CSV
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Download your last 7 days of activity data
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-1">🔒 Privacy First</div>
          <div className="text-xs text-muted-foreground">
            All your data stays on your device. We never send anything to external servers.
          </div>
        </div>
      </div>
    </Card>
  );
};