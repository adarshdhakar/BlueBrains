import React, { useMemo, useState, useRef, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import ResultSection from "../components/ResultSection";
import { toPercent } from "../utils/helpers";
import config from '../config.js';

// --- Color Palettes ---
const darkColors = {
  bg: "rgb(10,12,20)",
  card: "rgba(255,255,255,0.03)",
  text: "rgb(230,230,235)",
  subtext: "rgba(230,230,235,0.66)",
  border: "rgba(255,255,255,0.06)",
  accent: "rgb(6,165,225)",
  midBlue: "rgb(50,110,220)",
  darkBlue: "rgb(10,40,120)",
};

// --- Modal Component ---
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-3xl rounded-2xl shadow-2xl border dark:bg-[#2D2D2D]"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:opacity-80"
              aria-label="Close modal"
            >
              <X size={18} style={{ color: "var(--text)" }} />
            </button>
          </div>
          <div
            className="p-4 max-h-[70vh] overflow-auto"
            style={{ color: "var(--text)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- HOME PAGE ----
export default function Home({ theme, setTheme }) {
  // CORRECTED: Force the palette to always use darkColors
  const palette = darkColors;

  const cssVars = useMemo(
    () => ({
      "--bg": palette.bg,
      "--card": palette.card,
      "--text": palette.text,
      "--subtext": palette.subtext,
      "--border": palette.border,
      "--accent": palette.accent,
      "--midBlue": palette.midBlue,
      "--darkBlue": palette.darkBlue,
    }),
    [palette] // Dependency is now constant but kept for structure
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawOpen, setRawOpen] = useState(false);
  const [result, setResult] = useState(null);

  const resultsRef = useRef(null);

  const BASE =
    config.API_URL ||
    "https://misinformation-combater-backend-386097269689.europe-west1.run.app";
  const API_URL = `${BASE}/api/v1/analysis/analyze`;

  const handleAnalyze = async (file, textInput) => {
    if (!textInput.trim() && !file) return;

    setError(null);
    setLoading(true);
    setResult(null);

    const getLocation = () =>
      new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          (err) => {
            console.warn("Could not get location, continuing without it.", err);
            resolve(null);
          }
        );
      });

    try {
      const location = await getLocation();
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      } else {
        formData.append("content", textInput);
      }

      if (location) {
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);
      }

      const res = await axios.post(API_URL, formData);
      setResult(res.data);
    } catch (e) {
      console.error("API error:", e);
      setError(
        "An error occurred with the analysis service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const score = toPercent(result?.credibility_score ?? null);

  return (
    <div
      className="min-h-screen w-full"
      style={{ ...cssVars, background: "var(--bg)" }}
    >
      {/* HEADER: Force theme prop to "dark" to ensure icon is correct */}
      <Header theme="dark" setTheme={setTheme} />

      <HeroSection
        theme="dark" // Pass "dark" to ensure HeroSection is also dark
        input={input}
        setInput={setInput}
        handleAnalyze={handleAnalyze}
        loading={loading}
        error={error}
        setError={setError}
      />

      <div ref={resultsRef}>
        {result && (
          <ResultSection
            score={score}
            result={result}
            setRawOpen={setRawOpen}
          />
        )}
      </div>

      <footer className="py-10">
        <div
          className="max-w-6xl mx-auto px-4 text-sm text-center"
          style={{ color: "var(--subtext)" }}
        >
          BlueBrains Misinformation Combater @2025
        </div>
      </footer>

      <Modal
        open={rawOpen}
        title="Raw Response"
        onClose={() => setRawOpen(false)}
      >
        <pre className="text-xs overflow-auto" style={{ color: "var(--text)" }}>
          {JSON.stringify(
            result ?? { hint: "Press Analyze to see a response." },
            null,
            2
          )}
        </pre>
      </Modal>
    </div>
  );
}
