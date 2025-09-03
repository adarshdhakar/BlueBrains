import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { TbRadar2 } from "react-icons/tb"; // 1. Import the icon

// --- Local Helper Functions for SVG rendering ---
const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

// --- Local Chart Component: RadarChart ---
function RadarChart({ axes = [], values = [], size = 220 }) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 24; // Radius with padding for labels
    const numAxes = axes.length;

    // Scale all values from 0-100 to the radius of the chart
    const max = 100;
    const valuePts = values.map((v, i) =>
        polarToCartesian(cx, cy, (v / max) * r, (i / numAxes) * 360)
    );
    const axisPts = axes.map((_, i) =>
        polarToCartesian(cx, cy, r, (i / numAxes) * 360)
    );

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Axis lines and background polygon */}
            <polygon
                points={axisPts.map((p) => p.join(",")).join(" ")}
                fill="transparent"
                stroke="var(--border)"
                strokeWidth="0.6"
            />
            {axisPts.map((p, i) => (
                <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={p[0]}
                    y2={p[1]}
                    stroke="var(--border)"
                    strokeWidth="0.8"
                />
            ))}

            {/* Data polygon */}
            <polygon
                points={valuePts.map((p) => p.join(",")).join(" ")}
                fill="var(--accentGreen)"
                fillOpacity="0.25"
                stroke="var(--accentGreen)"
                strokeWidth="1.5"
            />

            {/* Axis labels */}
            {axes.map((axis, i) => {
                const labelPos = polarToCartesian(cx, cy, r + 12, (i / numAxes) * 360);
                return (
                    <text
                        key={i}
                        x={labelPos[0]}
                        y={labelPos[1]}
                        fontSize="11"
                        fill="var(--subtext)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {axis}
                    </text>
                );
            })}
        </svg>
    );
}

// --- Main Exported Component ---
export default function RadarPolarSection({ theme, sectionAccents, dragListeners}) {
    const [radarData, setRadarData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const BASE = import.meta.env.VITE_API_URL || "";
        const API_URL = `${BASE}/api/v1/trends/radar`;
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL);
                setRadarData(response.data || {});
            } catch (err) {
                setError("Failed to fetch radar data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Memoize chart data processing for efficiency
    const { radarAxes, radarVals } = useMemo(() => {
        const hasData = radarData && Object.keys(radarData).length > 0;

        const axes = hasData
            ? Object.keys(radarData)
            : ["Clarity", "Tone", "Correctness", "Originality", "Score"];
        const values = hasData ? Object.values(radarData) : [85, 70, 60, 75, 80];

        // Format labels for consistency (e.g., "credibility_score" -> "Credibility Score")
        const formattedAxes = axes.map((axis) =>
            axis.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
        );

        return { radarAxes: formattedAxes, radarVals: values };
    }, [radarData]);

    return (
        <section
            className="rounded-3xl border cursor-grab active:cursor-grabbing"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
            {...dragListeners}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b"
                style={{ borderColor: "var(--border)" }}
            >
                <div className="flex items-center gap-3">
                    {/* 2. Add the icon to the span */}
                    <span
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={sectionAccents.radar}
                    >
                        <TbRadar2
                            className="h-7 w-7"
                            style={{ color: "var(--primary-foreground)" }}
                        />
                    </span>
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>
                            Metric Averages
                        </div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>
                            Recent report analysis
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Radar Chart Container (2/3 width on desktop) */}
                <div className="md:col-span-2 rounded-xl flex justify-center items-center">
                    {loading ? (
                        <div
                            className="h-[220px] flex items-center justify-center text-xs"
                            style={{ color: "var(--subtext)" }}
                        >
                            Loading Chart...
                        </div>
                    ) : error ? (
                        <div className="h-[220px] flex items-center justify-center text-xs text-red-500">
                            {error}
                        </div>
                    ) : (
                        <RadarChart axes={radarAxes} values={radarVals} size={220} />
                    )}
                </div>

                {/* Notes Section (1/3 width on desktop) */}
                <div className="md:col-span-1 text-center md:text-left">
                    <div
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--text)" }}
                    >
                        Metric Analysis
                    </div>
                    <div className="text-xs" style={{ color: "var(--subtext)" }}>
                        This chart shows the average scores across key metrics from recent
                        reports.
                    </div>
                </div>
            </div>
        </section>
    );
}