
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Contrast, Smartphone, Monitor, Accessibility } from 'lucide-react';

export const ThemeSelector = () => {
  const { mode, size, setMode, setSize, isMobile } = useTheme();

  const themes = [
    {
      id: 'light' as const,
      name: 'Light Mode',
      description: 'Clean and bright interface',
      icon: Sun,
      preview: 'bg-white border border-gray-200',
    },
    {
      id: 'dark' as const,
      name: 'Dark Mode',
      description: 'Reduced eye strain in low light',
      icon: Moon,
      preview: 'bg-gray-900 border border-gray-700',
    },
    {
      id: 'high-contrast' as const,
      name: 'High Contrast',
      description: 'Maximum readability',
      icon: Contrast,
      preview: 'bg-white border-2 border-black',
    },
  ];

  const sizes = [
    {
      id: 'normal' as const,
      name: 'Normal',
      description: 'Standard sizing',
      icon: Monitor,
    },
    {
      id: 'large' as const,
      name: 'Large',
      description: 'Bigger text and spacing',
      icon: Accessibility,
    },
    {
      id: 'touch-friendly' as const,
      name: 'Touch Friendly',
      description: 'Optimized for touch devices',
      icon: Smartphone,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Theme Settings</h2>
        <p className="text-muted-foreground">
          Customize the appearance and accessibility of your interface
        </p>
        {isMobile && (
          <Badge variant="outline" className="mt-2">
            Mobile Device Detected
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Color Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              return (
                <div
                  key={theme.id}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                    mode === theme.id ? 'border-primary shadow-md' : 'border-border'
                  }`}
                  onClick={() => setMode(theme.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{theme.name}</span>
                    {mode === theme.id && (
                      <Badge variant="default" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className={`h-12 rounded ${theme.preview} mb-2`} />
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Interface Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sizes.map((sizeOption) => {
              const IconComponent = sizeOption.icon;
              return (
                <Button
                  key={sizeOption.id}
                  variant={size === sizeOption.id ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setSize(sizeOption.id)}
                >
                  <IconComponent className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">{sizeOption.name}</div>
                    <div className="text-xs opacity-80">{sizeOption.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">Sample Interface</h3>
            <div className="space-y-2">
              <Button>Primary Button</Button>
              <Button variant="outline">Secondary Button</Button>
              <p className="text-sm text-muted-foreground">
                This is how text will appear in the selected theme.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
