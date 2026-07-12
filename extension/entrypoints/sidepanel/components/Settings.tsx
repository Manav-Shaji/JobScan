import React from 'react';
import { Switch, Label, Separator } from '@/extension/ui';

export function Settings({ settings, setSettings, handleClearHistory }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Auto Analysis</Label>
            <p className="text-xs text-muted-foreground">Automatically scan supported jobs</p>
          </div>
          <Switch 
            checked={settings.autoAnalyze} 
            onCheckedChange={(c) => setSettings({...settings, autoAnalyze: c})} 
          />
        </div>
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Notifications</Label>
            <p className="text-xs text-muted-foreground">Alert me of high-risk jobs</p>
          </div>
          <Switch 
            checked={settings.notifications} 
            onCheckedChange={(c) => setSettings({...settings, notifications: c})} 
          />
        </div>
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base text-red-500">Danger Zone</Label>
          </div>
          <button onClick={handleClearHistory} className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-semibold rounded hover:bg-red-500/20">
            Clear Local Data
          </button>
        </div>
      </div>
    </div>
  );
}
