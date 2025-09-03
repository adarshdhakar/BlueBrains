import React, { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const MicrophoneButton = ({ onTranscript, onListenStateChange }) => {
  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onFinalResult: onTranscript,
  });

  useEffect(() => {
    onListenStateChange(isListening);
  }, [isListening, onListenStateChange]);

  const handleToggleListening = (e) => {
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      onClick={handleToggleListening}
      className={`p-3 rounded-full transition-colors ${
        isListening
          ? "bg-red-500/20 text-red-500 animate-pulse"
          : "hover:bg-gray-500/10"
      }`}
      aria-label={isListening ? "Stop listening" : "Start listening"}
      title={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <MicOff size={20} />
      ) : (
        <Mic size={20} style={{ color: "var(--text)" }} />
      )}
    </button>
  );
};

export default MicrophoneButton;
