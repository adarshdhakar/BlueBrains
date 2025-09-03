import React from "react";

export default function BarChart({ data = [], w = 320, h = 140 }) {
    const pad = 14;
    const count = data.length;
    const bw = (w - pad * 2) / (count || 1) - 8;
    const max = Math.max(...data, 1);
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="barG2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--barSecondary)" />
                    <stop offset="100%" stopColor="var(--barPrimary)" />
                </linearGradient>
            </defs>
            {data.map((v, i) => {
                const x = pad + i * (bw + 8);
                const barH = (v / max) * (h - pad * 2);
                const y = h - pad - barH;
                return (
                    <rect
                        key={i}
                        x={x}
                        y={y}
                        rx="4"
                        width={bw}
                        height={barH}
                        fill="url(#barG2)"
                    />
                );
            })}
        </svg>
    );
}
