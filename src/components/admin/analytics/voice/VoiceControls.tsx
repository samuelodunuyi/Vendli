
import { Button } from "@/components/ui/button";
import { Mic, MicOff, VolumeX } from "lucide-react";

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
}

export function VoiceControls({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onStopSpeaking
}: VoiceControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="lg"
        onClick={isListening ? onStopListening : onStartListening}
        className={`${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white rounded-full p-6`}
      >
        {isListening ? (
          <>
            <MicOff className="h-8 w-8 mr-2" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="h-8 w-8 mr-2" />
            Start Listening
          </>
        )}
      </Button>

      {isSpeaking && (
        <Button
          size="lg"
          variant="outline"
          onClick={onStopSpeaking}
          className="rounded-full p-6"
        >
          <VolumeX className="h-8 w-8 mr-2" />
          Stop Speaking
        </Button>
      )}
    </div>
  );
}
