
import { useState, useEffect } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  const speakResponse = (text: string) => {
    if (synthesis) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    isSpeaking,
    speakResponse,
    stopSpeaking
  };
}
