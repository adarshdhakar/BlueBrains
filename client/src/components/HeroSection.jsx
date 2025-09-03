import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  File as FileIcon,
  X,
  Music,
  FileText,
  Film,
} from "lucide-react";
import MicrophoneButton from "./MicrophoneButton";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

const HeroSection = ({ theme, handleAnalyze, loading, error, setError }) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (file && file.type.startsWith("image")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  const validateAndSetFile = (f) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_BYTES) {
      const msg = `File too large. Max ${
        MAX_FILE_SIZE_BYTES / (1024 * 1024)
      } MB.`;
      if (setError) setError(msg);
      else console.warn(msg);
      return;
    }
    setFile(f);
    if (setError) setError(null);
    setInput("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (setError) setError(null);
  };

  const onAnalyzeClick = () => {
    handleAnalyze(file, input);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !loading &&
      (input.trim() || file)
    ) {
      e.preventDefault();
      onAnalyzeClick();
    }
  };

  const humanSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image"))
      return <FileIcon className="w-10 h-10 text-blue-400" />;
    if (fileType.startsWith("audio"))
      return <Music className="w-10 h-10 text-purple-400" />;
    if (fileType.startsWith("video"))
      return <Film className="w-10 h-10 text-red-400" />;
    return <FileText className="w-10 h-10 text-gray-400" />;
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          src="https://my.spline.design/cybernetwork-2vreeLlp7aehGATtB7A6cw8U/"
          frameBorder="0"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Spline Scene"
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-3xl shadow-2xl border p-4 md:p-6 backdrop-blur-md"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div
            className={`transition-colors duration-300 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center ${
              isDragging ? "border-blue-500 bg-blue-500/10" : ""
            }`}
            style={{ borderColor: "var(--border)" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <div
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <UploadCloud
                    className="w-8 h-8 mb-3 mx-auto"
                    style={{ color: "var(--subtext)" }}
                  />
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    Click to browse or drag & drop
                  </p>
                  <p className="text-sm" style={{ color: "var(--subtext)" }}>
                    Image, Audio, PDF, or DOCX (Max 15MB)
                  </p>
                </div>

                <div
                  className="w-full mt-4 text-sm"
                  style={{ color: "var(--subtext)" }}
                >
                  OR
                </div>

                <div className="relative w-full flex items-center mt-4">
                  <textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (file) setFile(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isListening
                        ? "Listening..."
                        : "Paste text, URL, or use mic..."
                    }
                    rows={2}
                    className="w-full text-center px-4 py-3 pr-12 rounded-2xl border outline-none focus:ring-2 resize-none"
                    style={{
                      background:
                        theme === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <MicrophoneButton
                      onTranscript={(transcript) =>
                        setInput(input + transcript)
                      }
                      onListenStateChange={setIsListening}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-40 rounded-lg shadow-lg mb-4"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    {getFileIcon(file.type)}
                  </div>
                )}
                <p
                  className="font-semibold truncate max-w-full px-4"
                  style={{ color: "var(--text)" }}
                >
                  {file.name}
                </p>
                <p className="text-sm" style={{ color: "var(--subtext)" }}>
                  {humanSize(file.size)}
                </p>
                <button
                  onClick={removeFile}
                  className="mt-4 text-sm text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,audio/*,.pdf,.doc,.docx"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={onAnalyzeClick}
              disabled={loading || (!input.trim() && !file)}
              className="w-full md:w-auto shrink-0 px-8 py-3 rounded-2xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity text-white"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent" />
                  Analyzing…
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>

          {error && (
            <div
              className="mt-3 text-sm text-center"
              style={{ color: "var(--subtext)" }}
            >
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
