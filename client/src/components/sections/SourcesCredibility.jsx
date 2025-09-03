import React, { useState, useEffect, useCallback } from "react";
import { clamp } from "../charts/chartUtils";
import axios from "axios";
import { IoNewspaperOutline } from "react-icons/io5";

// A reusable skeleton item component for the loading state.
const SkeletonItem = () => (
    <div className="animate-pulse">
        <div className="flex items-center justify-between">
            <div className="h-4 rounded w-3/5" style={{ background: "var(--border)" }}></div>
            <div className="h-4 rounded w-1/6" style={{ background: "var(--border)" }}></div>
        </div>
        <div className="h-2 w-full rounded-full mt-2" style={{ background: "var(--border)" }}></div>
    </div>
);


function SourcesCredibility({ palette, sectionAccents, dragListeners }) {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE = import.meta.env.VITE_API_URL || "";
    const API_URL = `${BASE}/api/v1/trends/sources`;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            let fetched = response.data?.top_sources || [];
            fetched.sort((a, b) => b.percentage - a.percentage);
            setSources(fetched);
        } catch (err) {
            setError("Failed to fetch sources. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const topSources = sources.slice(0, 5);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => <SkeletonItem key={i} />)}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-4">
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

        if (sources.length === 0) {
            return (
                <div className="text-center py-4 text-sm" style={{ color: "var(--subtext)" }}>
                    No sources found.
                </div>
            );
        }
        return (
            <>
                {topSources.map((src, i) => {
                    const pct = clamp(src.percentage, 0, 100);
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-semibold truncate" style={{ color: "var(--text)" }}>
                                        {src.domain || "Unknown"}
                                    </div>
                                    <div style={{ color: "var(--subtext)" }}>{pct}%</div>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden mt-2" style={{ background: "var(--border)" }}>
                                    <div
                                        style={{
                                            width: `${pct}%`,
                                            height: "100%",
                                            background: "var(--gradientBlueGreen)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <section
            className="rounded-3xl border pb-3 sm:pb-4 cursor-grab active:cursor-grabbing"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
            {...dragListeners}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between py-2 sm:py-3 border-b mb-3 w-full"
                style={{ borderColor: "var(--border)" }}
            >
                <div className="flex items-center gap-3 px-3 sm:px-4">
                    <span
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={sectionAccents.bar}
                    >
                        {/* 2. Replace the SVG with the imported icon component */}
                        <IoNewspaperOutline
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

                {!loading && !error && (
                    <div className="text-xs px-3 sm:px-4 " style={{ color: "var(--subtext)" }}>
                        {sources.length} sources
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-3 px-3 sm:px-4">
                {renderContent()}
            </div>
        </section>

    );
}

export default React.memo(SourcesCredibility);