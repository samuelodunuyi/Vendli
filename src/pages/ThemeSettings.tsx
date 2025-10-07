
import { Link } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useTheme } from "@/context/ThemeContext";

const ThemeSettings = () => {
  const { mode, size, isMobile } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/pos">
              <Button variant="secondary" size="sm" className="touch-target">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to POS
              </Button>
            </Link>
            <h1 className="text-xl font-bold flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Theme & Accessibility Settings
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              Mode: {mode} | Size: {size}
              {isMobile && " | Mobile"}
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        <ThemeSelector />
        
        <div className="mt-8 bg-card rounded-lg shadow-md p-6 border">
          <h3 className="text-lg font-semibold mb-4">Accessibility Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">High Contrast Mode</h4>
              <p className="text-sm text-muted-foreground">
                Provides maximum contrast for users with visual impairments. 
                Ideal for bright environments or users with low vision.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Touch-Friendly Interface</h4>
              <p className="text-sm text-muted-foreground">
                Larger touch targets and spacing optimized for tablet and 
                touch screen interactions in busy retail environments.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Mobile Responsive</h4>
              <p className="text-sm text-muted-foreground">
                Automatic layout adjustments for phones and tablets. 
                Critical features remain accessible on smaller screens.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-lg shadow-md p-6 border">
          <h3 className="text-lg font-semibold mb-4">Industry Optimizations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Restaurant Mode</h4>
              <p className="text-sm text-muted-foreground">
                Quick access to table management, order modifications, and 
                kitchen communication. Optimized for fast-paced service.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Retail Mode</h4>
              <p className="text-sm text-muted-foreground">
                Streamlined checkout process, inventory alerts, and 
                customer management tools for retail environments.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThemeSettings;
