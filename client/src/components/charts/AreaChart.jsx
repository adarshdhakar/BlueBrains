import React from "react";
import { pointsToPath } from "./chartUtils";

export default function AreaChart({ data = [], w = 320, h = 140 }) {
    const pad = 14;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * (w - pad * 2) + pad;
        const y = h - ((d - min) / (max - min || 1)) * (h - pad * 2) - pad;
        return [x, y];
    });
    const top = pointsToPath(pts);
    const bottom = `L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="aGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--accentGreen)" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="var(--midGreen)" stopOpacity="0.06" />
                </linearGradient>
            </defs>
            <path d={`${top} ${bottom}`} fill="url(#aGrad)" />
            <path d={top} fill="none" stroke="var(--darkGreen)" strokeWidth="1.25" />
        </svg>
    );
}
