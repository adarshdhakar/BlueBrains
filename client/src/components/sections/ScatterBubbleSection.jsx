import React from "react";
import { ScatterPlot, BubblePlot } from "../charts/ScatterAndBubble";

export default function ScatterBubbleSection({ scatterData, bubbleData, palette, theme, sectionAccents }) {
    return (
        <section className="rounded-3xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg" style={sectionAccents.scatter} />
                    <div>
                        <div className="font-bold" style={{ color: "var(--text)" }}>Scatter & Bubble</div>
                        <div className="text-xs" style={{ color: "var(--subtext)" }}>Outliers & clusters</div>
                    </div>
                </div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>Dispersion</div>
            </div>

            <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                <div className="rounded-xl p-2 sm:p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Scatter — hourly</div>
                    <ScatterPlot data={scatterData} />
                </div>
                <div className="rounded-xl p-2 sm:p-3" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)" }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Bubble — severity vs reach</div>
                    <BubblePlot data={bubbleData} palette={palette.palette} />
                </div>
            </div>
        </section>
    );
}
