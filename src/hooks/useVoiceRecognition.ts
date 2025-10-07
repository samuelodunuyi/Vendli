
import { useState, useEffect } from "react";
import { VoiceCommand } from "@/types/forecasting";

interface UseVoiceRecognitionProps {
  onCommand?: (command: string) => void;
}

export function useVoiceRecognition({ onCommand }: UseVoiceRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        handleVoiceCommand(command, confidence);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string, confidence: number) => {
    if (onCommand) {
      onCommand(command);
    }
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    startListening,
    stopListening
  };
}
