
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { VoiceCommand } from "@/types/forecasting";
import { VoiceControls } from "./voice/VoiceControls";
import { VoiceStatus } from "./voice/VoiceStatus";
import { SuggestedCommands } from "./voice/SuggestedCommands";
import { CommandHistory } from "./voice/CommandHistory";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { generateAIResponse } from "@/utils/aiResponseGenerator";

interface ConversationalAIProps {
  onCommand?: (command: string) => void;
}

const mockCommands: VoiceCommand[] = [
  {
    id: "1",
    command: "What are today's sales?",
    response: "Today's sales are ₦2.4 million, which is 15% higher than yesterday.",
    timestamp: "2024-01-10T14:30:00Z",
    confidence: 0.95
  },
  {
    id: "2", 
    command: "Check inventory for Samsung Galaxy S23",
    response: "Samsung Galaxy S23 has 12 units in stock. AI recommends ordering 50 units due to high demand.",
    timestamp: "2024-01-10T14:25:00Z",
    confidence: 0.92
  },
  {
    id: "3",
    command: "Show me staff schedule for tomorrow",
    response: "Tomorrow's schedule: 8 staff members scheduled, peak hours 12-3 PM are fully covered.",
    timestamp: "2024-01-10T14:20:00Z",
    confidence: 0.88
  }
];

export function ConversationalAI({ onCommand }: ConversationalAIProps) {
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>(mockCommands);

  const { isSpeaking, speakResponse, stopSpeaking } = useSpeechSynthesis();
  
  const handleVoiceCommand = (command: string, confidence: number) => {
    const response = generateAIResponse(command);
    setCurrentResponse(response);

    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      command,
      response,
      timestamp: new Date().toISOString(),
      confidence
    };

    setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)]);
    speakResponse(response);

    if (onCommand) {
      onCommand(command);
    }
  };

  const { isListening, startListening, stopListening } = useVoiceRecognition({
    onCommand: (command) => handleVoiceCommand(command, 0.95)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Voice Assistant</h2>
        </div>
        <Badge variant="outline" className="text-sm">
          {isListening ? 'Listening...' : 'Ready'}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeaking={stopSpeaking}
          />

          <VoiceStatus
            isListening={isListening}
            isSpeaking={isSpeaking}
            currentResponse={currentResponse}
          />

          <SuggestedCommands />
        </CardContent>
      </Card>

      <CommandHistory commands={commandHistory} />
    </div>
  );
}
