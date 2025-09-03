import React, { useState, useEffect, useMemo } from "react";
import Graph from "../Graph2";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoGlobeOutline, IoLocationOutline, IoMove } from "react-icons/io5";

export default function MapCard({
  theme,
  sectionAccents,
  dragListeners,
  isDragging = false,
}) {
  const [heatmapData, setHeatmapData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both heatmap and detailed reports data concurrently
        const heatmapPromise = axios.get(
          `${BASE_URL}/api/v1/dashboard/heatmap`
        );
        const reportsPromise = axios.get(
          `${BASE_URL}/api/v1/dashboard/recentReports`
        );

        const [heatmapResponse, reportsResponse] = await Promise.all([
          heatmapPromise,
          reportsPromise,
        ]);

        setHeatmapData(heatmapResponse.data || []);
        setReportsData(reportsResponse.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch map data:", err);
        setError("Could not load map data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BASE_URL]);

  // This hook processes the raw report data to find the top 3 states
  const topRegionsString = useMemo(() => {
    if (!reportsData || reportsData.length === 0) {
      return "No recent reports";
    }

    // Count the occurrences of each state
    const stateCounts = reportsData.reduce((acc, report) => {
      if (report.state && report.state !== "Unknown") {
        acc[report.state] = (acc[report.state] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort the states by count in descending order
    const sortedStates = Object.keys(stateCounts).sort(
      (a, b) => stateCounts[b] - stateCounts[a]
    );

    // Get the top 3 and join them into a string, or show a default message
    return sortedStates.slice(0, 5).join(" • ") || "No locations reported";
  }, [reportsData]);

  return (
    <section
      className="rounded-3xl border overflow-hidden flex flex-col"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center gap-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex gap-3 items-center">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={sectionAccents.map}
          >
            <IoGlobeOutline
              className="h-6 w-6"
              style={{ color: "var(--primary-foreground, white)" }}
            />
          </span>
          <div>
            <div className="font-bold" style={{ color: "var(--text)" }}>
              Geographic View
            </div>
            <div className="text-xs" style={{ color: "var(--subtext)" }}>
              Interactive map of reports
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/view-reports"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              color: "var(--buttonText)",
              background: "var(--accentBlue)",
            }}
          >
            View More
          </Link>
          <div
            {...dragListeners}
            style={{ cursor: "grab", color: "var(--subtext)", padding: "8px" }}
            className="active:cursor-grabbing"
          >
            <IoMove className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="w-full h-80 md:h-96 relative">
        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: "var(--subtext)" }}
          >
            Loading Map...
          </div>
        )}
        {error && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ color: "var(--subtext)" }}
          >
            {error}
          </div>
        )}
        {!loading &&
          !error &&
          (isDragging ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-500/10">
              <div style={{ color: "var(--subtext)" }}>Map Preview</div>
            </div>
          ) : (
            // Pass both heatmap and reports data to the Graph component
            <Graph
              theme={theme}
              heatmapData={heatmapData}
              reportsData={reportsData}
            />
          ))}
      </div>

      <div
        className="p-2 sm:p-4 grid grid-cols-1 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(120, 140, 170, 0.05)" }}
        >
          <div
            className="text-xs flex items-center gap-2"
            style={{ color: "var(--subtext)" }}
          >
            <IoLocationOutline />
            Top Regions
          </div>
          <div
            className="mt-2 text-sm sm:text-base font-semibold truncate"
            style={{ color: "var(--text)" }}
          >
            {topRegionsString}
          </div>
        </div>
      </div>
    </section>
  );
}
