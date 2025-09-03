import React, { useState } from "react";
import { IoChevronDown, IoLinkOutline, IoMapOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Functions (can be moved to a utils file) ---
const formatTimestamp = (isoString) => {
  if (!isoString) return "";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(isoString));
};

const getCredibilityStyle = (score) => {
  if (score >= 75)
    return {
      color: "#22c55e",
      text: `🟢 Credible (${score}%)`,
      ring: "ring-green-500/30",
    };
  if (score >= 50)
    return {
      color: "#f97316",
      text: `🟡 Use Discretion (${score}%)`,
      ring: "ring-orange-500/30",
    };
  if (score >= 25)
    return {
      color: "#f59e0b",
      text: `🟠 Potentially Misleading (${score}%)`,
      ring: "ring-yellow-500/30",
    };
  return {
    color: "#ef4444",
    text: `🔴 Highly Misleading (${score}%)`,
    ring: "ring-red-500/30",
  };
};

const MetricBar = ({ label, score }) => (
  <div>
    <div className="flex justify-between items-center text-xs mb-1">
      <span style={{ color: "var(--text)" }}>{label}</span>
      <span className="font-medium" style={{ color: "var(--subtext)" }}>
        {score}%
      </span>
    </div>
    <div
      className="h-2 w-full rounded-full overflow-hidden"
      style={{ background: "var(--border)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${score}%`,
          background: score > 50 ? "var(--accentBlue)" : "#f59e0b",
        }}
      />
    </div>
  </div>
);

// --- Main Report Card Component ---
const ReportCard = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const credibility = getCredibilityStyle(report.credibility_score);

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:ring-2 ${credibility.ring}`}
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* --- Main Info Row --- */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3 gap-3 text-sm">
            <span
              className="px-3 py-1 rounded-full font-medium"
              style={{ background: "var(--border)", color: "var(--subtext)" }}
            >
              {report.category}
            </span>
            <span style={{ color: credibility.color }}>{credibility.text}</span>
          </div>
          <p className="leading-relaxed text-base pr-4">
            {report.report_summary}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 p-2 rounded-full transition-colors hover:bg-[var(--border)] cursor-pointer"
          aria-label="Toggle details"
        >
          <IoChevronDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ color: "var(--subtext)" }}
          />
        </button>
      </div>

      {/* --- Timestamp and Location Row --- */}
      <div
        className="text-xs mt-4 flex justify-between items-center"
        style={{ color: "var(--subtext)" }}
      >
        <span>{formatTimestamp(report.timestamp)}</span>
        <span className="font-medium flex items-center gap-1.5">
          <IoMapOutline />
          {report.state || "Unknown Location"}
        </span>
      </div>

      {/* --- Expandable Details Section --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: "20px" }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Detailed Analysis */}
            <div className="mb-4">
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Detailed Analysis
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--subtext)" }}
              >
                {report.analysis}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <MetricBar label="Clarity" score={report.metrics.clarity} />
              <MetricBar label="Tone" score={report.metrics.tone} />
              <MetricBar
                label="Correctness"
                score={report.metrics.correctness}
              />
              <MetricBar
                label="Originality"
                score={report.metrics.originality}
              />
            </div>

            {/* Sources List */}
            <div>
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Sources Used
              </h4>
              {report.source_domains && report.source_domains.length > 0 ? (
                <ul className="space-y-2">
                  {report.source_domains.map((url, i) => (
                    <li key={i} className="text-sm">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:underline"
                        style={{ color: "var(--accentBlue)" }}
                      >
                        <IoLinkOutline />
                        <span className="truncate">{url}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "var(--subtext)" }}>
                  No external sources were used for this analysis.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportCard;
