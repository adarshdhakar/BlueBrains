import { useState, useEffect, useRef, useCallback } from "react";

// Access the browser's speech recognition object, handling vendor prefixes
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = ({ onFinalResult }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if the browser supports speech recognition
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop listening after the user pauses
    recognition.interimResults = true; // Get results as the user speaks
    recognition.lang = "en-IN"; // Set language to Indian English for better accuracy

    // Event handler for when speech is recognized
    recognition.onresult = (event) => {
      let finalTranscript = "";
      // Iterate through results to find the final one
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      // If a final transcript is found, call the parent's callback function
      if (finalTranscript && onFinalResult) {
        onFinalResult(finalTranscript);
      }
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    // Fired when speech recognition service has disconnected
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onFinalResult]); // Rerun effect if the callback function changes

  // Function to start the recognition service
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Function to stop the recognition service
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, startListening, stopListening };
};

