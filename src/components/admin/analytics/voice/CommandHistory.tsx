
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceCommand } from "@/types/forecasting";

interface CommandHistoryProps {
  commands: VoiceCommand[];
}

export function CommandHistory({ commands }: CommandHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {commands.map((cmd) => (
            <div key={cmd.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {(cmd.confidence * 100).toFixed(0)}% confidence
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(cmd.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">"{cmd.command}"</p>
                <p className="text-sm text-gray-600">{cmd.response}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
