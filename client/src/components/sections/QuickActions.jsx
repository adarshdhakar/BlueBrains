import React from "react";

export default function QuickActions({ theme }) {
    return (
        <section className="rounded-3xl border p-3 sm:p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-2">
                <div className="font-bold" style={{ color: "var(--text)" }}>Quick Actions</div>
                <div className="text-xs" style={{ color: "var(--subtext)" }}>Policy tools</div>
            </div>
            <div className="flex flex-col gap-3">
                <button className="px-4 py-2 rounded-xl text-left text-sm" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)", border: "1px solid var(--border)", color: "var(--text)" }}>
                    Bulk review flagged (120)
                </button>
                <button className="px-4 py-2 rounded-xl text-left text-sm" style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.02)", border: "1px solid var(--border)", color: "var(--text)" }}>
                    Export suspicious content
                </button>
                <button className="px-4 py-2 rounded-xl text-left text-sm font-semibold" style={{ background: "var(--accentBlue)", color: "white" }}>
                    Open case manager
                </button>
            </div>
        </section>
    );
}
