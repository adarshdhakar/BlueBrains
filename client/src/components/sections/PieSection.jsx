import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { HiOutlineChartPie } from "react-icons/hi"; // 1. Import the icon

// A color mapping for different misinformation categories.
const categoryColors = {
    Health: "#4CAF50",
    Political: "#2196F3",
    Financial: "#FF9800",
    Science: "#9C27B0",
    Social: "#E91E63",
    Satire: "#795548",
    Geopolitics: "#FFC107",
    None: "#9E9E9E",
    Other: "#607D8B",
    "Unreliable Information": "red",
    "Out of Context": "#00BCD4",
};

// --- Helper Functions for SVG rendering (unchanged) ---
const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

const pieSlicePath = (cx, cy, r, startAngle, endAngle) => {
    const [x1, y1] = polarToCartesian(cx, cy, r, endAngle);
    const [x0, y0] = polarToCartesian(cx, cy, r, startAngle);
    const laf = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${laf} 1 ${x1} ${y1} Z`;
};


// --- Reusable PieChart Component (unchanged) ---
function PieChart({
    values = [],
    colors = [],
    size = 120,
    donut = false,
    inner = 36,
    donutLabel = "",
}) {
    const total = values.reduce((a, b) => a + b, 0) || 1;
    let angle = 0;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {values.map((v, i) => {
                const start = angle;
                const portion = (v / total) * 360;
                const end = start + portion;
                angle = end;
                const path = pieSlicePath(size / 2, size / 2, size / 2 - 2, start, end);
                return (
                    <path
                        key={i}
                        d={path}
                        fill={colors[i % colors.length]}
                        stroke="var(--card)"
                        strokeWidth="0.5"
                    />
                );
            })}
            {donut && (
                <circle cx={size / 2} cy={size / 2} r={inner} fill="var(--card)" />
            )}
            {donut && donutLabel && (
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy="6"
                    fontSize="13"
                    fill="var(--text)"
                    fontWeight="700"
                >
                    {donutLabel}
                </text>
            )}
        </svg>
    );
}

// --- Skeleton Component for Loading State ---
const PieSectionSkeleton = () => (
    <div className="p-2 sm:p-4 flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-4 animate-pulse">
        <div className="flex-shrink-0 w-[120px] h-[120px] rounded-full" style={{ background: 'var(--border)' }} />
        <div className="w-full flex-1 space-y-3 pt-1">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--border)' }} />
                        <div className="h-4 w-3/5 rounded" style={{ background: 'var(--border)' }} />
                    </div>
                    <div className="h-4 w-1/6 rounded" style={{ background: 'var(--border)' }} />
                </div>
            ))}
        </div>
    </div>
);


// --- Main Section Component ---
export default function PieSection({ theme, sectionAccents, dragListeners }) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE = import.meta.env.VITE_API_URL || "";
    const API_URL = `${BASE}/api/v1/dashboard/categories`;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setData(response.data);
        } catch (err) {
            setError("Failed to fetch category data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { chartKeys, chartValues, donutLabel, categoryTotal } = useMemo(() => {
        if (!data || Object.keys(data).length === 0) {
            return { chartKeys: [], chartValues: [], donutLabel: "", categoryTotal: 1 };
        }
        const sortedEntries = Object.entries(data).sort(([, a], [, b]) => b - a);
        const keys = sortedEntries.map(([key]) => key);
        const values = sortedEntries.map(([, value]) => value);
        const total = values.reduce((a, b) => a + b, 0) || 1;
        const label = values.length > 0 ? `${Math.round((values[0] / total) * 100)}%` : "";
        return { chartKeys: keys, chartValues: values, donutLabel: label, categoryTotal: total };
    }, [data]);

    const renderBody = () => {
        if (loading) {
            return <PieSectionSkeleton />;
        }

        if (error) {
            return (
                <div className="p-4 text-center">
                    <p className="text-red-500 mb-3 text-sm">{error}</p>
                    <button
                        onClick={fetchData}
                        className="px-4 py-1 text-sm rounded transition-colors"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                        Retry
                    </button>
                </div>
            );
        }
        
        if (chartKeys.length === 0) {
            return (
                 <div className="p-4 text-center text-sm" style={{ color: "var(--subtext)" }}>
                     No category data available.
                 </div>
            )
        }

        return (
            <div className="p-2 sm:p-4 flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-4">
                <div className="flex-shrink-0">
                    <PieChart
                        values={chartValues}
                        colors={chartKeys.map((k) => categoryColors[k] || "#cccccc")}
                        size={120}
                        donut
                        inner={30}
                        donutLabel={donutLabel}
                    />
                </div>
                <div className="w-full flex-1">
                    {chartKeys.map((label, i) => {
                        const pct = Math.round((chartValues[i] / categoryTotal) * 100) || 0;
                        const colorKey = chartKeys[i] || "Other";
                        return (
                            <div key={i} className="flex items-center justify-between py-1 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-sm" style={{ background: categoryColors[colorKey] || "#cccccc" }} />
                                    <div style={{ color: "var(--text)" }}>{label}</div>
                                </div>
                                <div style={{ color: "var(--subtext)" }}>{pct}%</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <section
            className="rounded-3xl border cursor-grab active:cursor-grabbing"
            style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                boxShadow: theme === "dark" ? "0 6px 30px rgba(0,0,0,0.45)" : "0 6px 20px rgba(15,23,42,0.03)",
            }}
            {...dragListeners}
        >
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                    {/* 2. Icon placed in the span */}
                    <span
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={sectionAccents.pie}
                    >
                        <HiOutlineChartPie
                            className="h-7 w-7"
                            style={{ color: "var(--primary-foreground)" }}
                        />
                    </span>
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>Category Breakdown</div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>Distribution from recent reports</div>
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>Proportion</div>
            </div>
            {renderBody()}
        </section>
    );
}