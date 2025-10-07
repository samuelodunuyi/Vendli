
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Volume2 } from "lucide-react";

interface VoiceStatusProps {
  isListening: boolean;
  isSpeaking: boolean;
  currentResponse: string;
}

export function VoiceStatus({ isListening, isSpeaking, currentResponse }: VoiceStatusProps) {
  return (
    <>
      {isListening && (
        <Alert className="border-blue-200 bg-blue-50">
          <Mic className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            Listening for your command... Try: "What are today's sales?" or "Check inventory levels"
          </AlertDescription>
        </Alert>
      )}

      {isSpeaking && (
        <Alert className="border-green-200 bg-green-50">
          <Volume2 className="h-4 w-4" />
          <AlertDescription className="text-green-800">
            Speaking response: {currentResponse}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
