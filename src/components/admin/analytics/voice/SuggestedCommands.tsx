
import { Badge } from "@/components/ui/badge";

export function SuggestedCommands() {
  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-gray-600">Try these voice commands:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="outline">"Show today's sales"</Badge>
        <Badge variant="outline">"Check inventory status"</Badge>
        <Badge variant="outline">"Staff schedule today"</Badge>
        <Badge variant="outline">"Any fraud alerts?"</Badge>
      </div>
    </div>
  );
}
