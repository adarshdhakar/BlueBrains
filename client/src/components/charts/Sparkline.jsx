import React from "react";
import { pointsToPath } from "./chartUtils";

export default function Sparkline({ data = [], width = 140, height = 36 }) {
    const pad = 4;
    const w = width,
        h = height;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * (w - pad * 2) + pad;
        const y = h - ((d - min) / (max - min || 1)) * (h - pad * 2) - pad;
        return [x, y];
    });
    const d = pointsToPath(pts);
    const last = pts[pts.length - 1] || [0, 0];

    return (
        <svg width={w} height={h}>
            <path
                d={d}
                stroke="var(--accentGreen)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <circle cx={last[0]} cy={last[1]} r="3" fill="var(--accentGreen)" />
        </svg>
    );
}
