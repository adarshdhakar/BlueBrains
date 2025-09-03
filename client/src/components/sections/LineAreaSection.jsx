import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { IoAnalyticsOutline } from "react-icons/io5"; // 1. Import the icon
import config from '../../config.js';

// --- Helper function to calculate nice intervals for the Y-axis ---
function generateYTicks(dataMax) {
  if (dataMax <= 1) return { ticks: [0, 1], niceMax: 1 };

  const numTicks = 4; // Aim for around 4 tick marks
  const range = dataMax;
  const roughStep = range / (numTicks - 1);

  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const res = roughStep / magnitude;

  let niceStep;
  if (res > 5) niceStep = 10 * magnitude;
  else if (res > 2) niceStep = 5 * magnitude;
  else if (res > 1) niceStep = 2 * magnitude;
  else niceStep = magnitude;

  const niceMax = Math.ceil(dataMax / niceStep) * niceStep;

  const ticks = [];
  for (let i = 0; i <= niceMax; i += niceStep) {
    ticks.push(i);
  }

  return { ticks, niceMax };
}

// --- Helper Function ---
const pointsToPath = (pts) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

// --- Local Chart Component: LineChart ---
function LineChart({ data = [], labels = [], w = 320, h = 140 }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: h,
          display: "grid",
          placeContent: "center",
        }}
      >
        <span style={{ color: "var(--subtext)", fontSize: "12px" }}>
          No data
        </span>
      </div>
    );
  }

  const padY = 20;
  const padX = 30;
  const graphHeight = h - padY;
  const graphWidth = w - padX;

  const min = 0;
  const { ticks: yAxisLabels, niceMax: max } = generateYTicks(
    Math.max(...data)
  );

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (graphWidth - 10) + padX + 5;
    const yVal = (d - min) / (max - min || 1);
    const y = graphHeight - yVal * (graphHeight - 10) - 5;
    return [x, y];
  });

  const path = pointsToPath(pts);
  const labelInterval = Math.ceil(labels.length / 7);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {yAxisLabels.map((label, i) => {
        const yVal = (label - min) / (max - min || 1);
        const y = graphHeight - yVal * (graphHeight - 10) - 5;
        return (
          <g key={i}>
            <text
              x={padX - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="var(--subtext)"
            >
              {label}
            </text>
            <line
              x1={padX}
              y1={y}
              x2={w}
              y2={y}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
      <path
        d={path}
        fill="none"
        stroke="var(--midBlue)"
        strokeWidth="3"
        opacity="0.12"
        strokeLinecap="round"
      />
      <path
        d={path}
        fill="none"
        stroke="var(--accentBlue)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {labels.map((label, i) => {
        if (i > 0 && i % labelInterval !== 0 && i !== labels.length - 1)
          return null;
        const x = (i / (labels.length - 1 || 1)) * (graphWidth - 10) + padX + 5;
        return (
          <text
            key={i}
            x={x}
            y={h - 5}
            textAnchor="middle"
            fontSize="10"
            fill="var(--subtext)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// --- Local Chart Component: AreaChart ---
function AreaChart({ data = [], labels = [], w = 320, h = 140 }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: h,
          display: "grid",
          placeContent: "center",
        }}
      >
        <span style={{ color: "var(--subtext)", fontSize: "12px" }}>
          No data
        </span>
      </div>
    );
  }

  const padY = 20;
  const padX = 30;
  const graphHeight = h - padY;
  const graphWidth = w - padX;

  const min = 0;
  const { ticks: yAxisLabels, niceMax: max } = generateYTicks(
    Math.max(...data)
  );

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * (graphWidth - 10) + padX + 5;
    const yVal = (d - min) / (max - min || 1);
    const y = graphHeight - yVal * (graphHeight - 10) - 5;
    return [x, y];
  });

  const top = pointsToPath(pts);
  const bottom = `L ${w} ${h - padY} L ${padX} ${h - padY} Z`;
  const labelInterval = Math.ceil(labels.length / 7);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="aGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accentGreen)" stopOpacity="0.88" />
          <stop offset="100%" stopColor="var(--midGreen)" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      {yAxisLabels.map((label, i) => {
        const yVal = (label - min) / (max - min || 1);
        const y = graphHeight - yVal * (graphHeight - 10) - 5;
        return (
          <g key={i}>
            <text
              x={padX - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="var(--subtext)"
            >
              {label}
            </text>
            <line
              x1={padX}
              y1={y}
              x2={w}
              y2={y}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
      <path d={`${top} ${bottom}`} fill="url(#aGrad)" />
      <path d={top} fill="none" stroke="var(--darkGreen)" strokeWidth="1.25" />
      {labels.map((label, i) => {
        if (i > 0 && i % labelInterval !== 0 && i !== labels.length - 1)
          return null;
        const x = (i / (labels.length - 1 || 1)) * (graphWidth - 10) + padX + 5;
        return (
          <text
            key={i}
            x={x}
            y={h - 5}
            textAnchor="middle"
            fontSize="10"
            fill="var(--subtext)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// --- Local UI Component: TimeframeButton ---
const TimeframeButton = ({ label, active, onClick }) => (
  <button
    onClick={() => onClick(label)}
    className={`px-3 py-1 text-xs rounded-md transition-colors ${
      active
        ? "bg-[var(--accent)] text-white font-semibold"
        : "bg-transparent text-[var(--subtext)] hover:bg-[var(--border)]"
    }`}
  >
    {label}
  </button>
);

// --- Main Exported Component ---
function LineAreaSection({ theme, sectionAccents, dragListeners }) {
  const [trafficData, setTrafficData] = useState(null);
  const [timeframe, setTimeframe] = useState("Weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeframes = ["Daily", "Weekly", "Monthly"];

  const handleTimeframeSelect = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const BASE = config.API_URL || "";
    const API_URL = `${BASE}/api/v1/trends/traffic`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setTrafficData(response.data);
      } catch (err) {
        setError("Failed to fetch traffic data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    if (!trafficData) {
      return { reports: [], misinfo: [], labels: [] };
    }

    const key = timeframe.toLowerCase();
    const dataForTimeframe = trafficData[key]?.traffic || [];

    let labelKey = "date";
    if (key === "daily") labelKey = "hour";
    if (key === "weekly") labelKey = "day";

    const labels = dataForTimeframe.map((item) => {
      const label = item[labelKey];
      if (labelKey === "day") return label.slice(0, 3);
      if (labelKey === "hour") return label.split(":")[0];
      if (labelKey === "date") return label.slice(5);
      return label;
    });

    return {
      reports: dataForTimeframe.map((item) => item.reports),
      misinfo: dataForTimeframe.map((item) => item.total_misinfo_count),
      labels: labels,
    };
  }, [trafficData, timeframe]);

  return (
    <section
      className="rounded-3xl border"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        boxShadow:
          theme === "dark"
            ? "0 6px 30px rgba(0,0,0,0.4)"
            : "0 6px 20px rgba(15,23,42,0.04)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center gap-3 cursor-grab active:cursor-grabbing"
          {...dragListeners}
        >
          {/* 2. Add the icon inside the span */}
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={sectionAccents.line}
          >
            <IoAnalyticsOutline
              className="h-7 w-7"
              style={{ color: "var(--primary-foreground)" }}
            />
          </span>
          <div>
            <div className="font-bold" style={{ color: "var(--text)" }}>
              Traffic Trends
            </div>
            <div className="text-xs" style={{ color: "var(--subtext)" }}>
              Reports & misinformation volume
            </div>
          </div>
        </div>

        <div>
          <div
            className="hidden lg:flex items-center gap-1 p-1 rounded-lg"
            style={{ background: "rgba(0,0,0,0.1)" }}
          >
            {timeframes.map((label) => (
              <TimeframeButton
                key={label}
                label={label}
                active={timeframe === label}
                onClick={setTimeframe}
              />
            ))}
          </div>

          <div className="relative w-[25vw] lg:hidden">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs text-left bg-zinc-100 dark:bg-teal-600 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              <span>{timeframe}</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="black"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 w-full mt-2 origin-top-right bg-[var(--card)] border border-[var(--border)] rounded-md shadow-lg z-10">
                <div className="py-1">
                  {timeframes.map((label) => (
                    <button
                      key={label}
                      onClick={() => handleTimeframeSelect(label)}
                      className="block w-full px-4 py-2 text-xs text-left text-[var(--text)] hover:bg-[var(--border)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="p-2 sm:p-4 cursor-grab active:cursor-grabbing"
        {...dragListeners}
      >
        {loading ? (
          <div
            className="text-center py-10"
            style={{ color: "var(--subtext)" }}
          >
            Loading Chart Data...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <div
              className="rounded-xl p-2 sm:p-3"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(15,23,42,0.02)",
              }}
            >
              <div
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Total Reports ({timeframe})
              </div>
              <LineChart data={chartData.reports} labels={chartData.labels} />
            </div>
            <div
              className="rounded-xl p-2 sm:p-3"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(15,23,42,0.02)",
              }}
            >
              <div
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                Misinformation Reports ({timeframe})
              </div>
              <AreaChart data={chartData.misinfo} labels={chartData.labels} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(LineAreaSection);