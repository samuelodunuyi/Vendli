
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Settings, Monitor, Moon, Sun, Globe, Volume2, Smartphone } from "lucide-react";

export function SettingsPanel() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("WAT");

  return (
    <div className="space-y-6 py-4">
      {/* Theme Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Monitor className="h-5 w-5" />
          <h4 className="font-medium">Appearance</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Dark Mode</Label>
              <p className="text-xs text-gray-500">Switch to dark theme</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Notification Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5" />
          <h4 className="font-medium">Notifications</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Push Notifications</Label>
              <p className="text-xs text-gray-500">Receive system alerts</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Sound Effects</Label>
              <p className="text-xs text-gray-500">Play notification sounds</p>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Language & Region */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <h4 className="font-medium">Language & Region</h4>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ha">Hausa</SelectItem>
                <SelectItem value="yo">Yoruba</SelectItem>
                <SelectItem value="ig">Igbo</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WAT">West Africa Time (WAT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="GMT">GMT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* System Settings */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <h4 className="font-medium">System</h4>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Smartphone className="h-4 w-4 mr-2" />
            Backup Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Monitor className="h-4 w-4 mr-2" />
            Display Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="space-y-2">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
        <Button variant="ghost" className="w-full">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
