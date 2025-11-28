import { useState } from 'react';
import { SlippageSettings as SlippageSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SlippageSettingsProps {
  settings: SlippageSettingsType;
  onSettingsChange: (settings: SlippageSettingsType) => void;
}

export function SlippageSettings({ settings, onSettingsChange }: SlippageSettingsProps) {
  const [customSlippage, setCustomSlippage] = useState(
    (settings.tolerance * 100).toString()
  );

  const presetSlippages = [0.001, 0.005, 0.01];

  const handlePresetClick = (slippage: number) => {
    onSettingsChange({ ...settings, tolerance: slippage, autoSlippage: false });
    setCustomSlippage((slippage * 100).toString());
  };

  const handleCustomSlippageChange = (value: string) => {
    setCustomSlippage(value);
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSettingsChange({ ...settings, tolerance: numValue / 100, autoSlippage: false });
    }
  };

  const handleDeadlineChange = (value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      onSettingsChange({ ...settings, deadline: numValue });
    }
  };

  const handleAutoSlippageToggle = (checked: boolean) => {
    onSettingsChange({ ...settings, autoSlippage: checked });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Slippage Tolerance</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.autoSlippage}
                  onCheckedChange={handleAutoSlippageToggle}
                />
                <span className="text-sm text-muted-foreground">Auto</span>
              </div>
            </div>
            <div className="flex gap-2">
              {presetSlippages.map(slippage => (
                <Button
                  key={slippage}
                  variant={
                    settings.tolerance === slippage && !settings.autoSlippage
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() => handlePresetClick(slippage)}
                  className="flex-1"
                  disabled={settings.autoSlippage}
                >
                  {(slippage * 100).toFixed(1)}%
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="text"
                value={customSlippage}
                onChange={e => handleCustomSlippageChange(e.target.value)}
                placeholder="Custom"
                disabled={settings.autoSlippage}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            {Number(customSlippage) > 5 && (
              <p className="text-xs text-warning">
                ⚠️ High slippage tolerance may result in unfavorable trades
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Transaction Deadline</Label>
            <div className="relative">
              <Input
                type="number"
                value={settings.deadline}
                onChange={e => handleDeadlineChange(e.target.value)}
                min="1"
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                minutes
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Transaction will revert if pending for more than this duration
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
