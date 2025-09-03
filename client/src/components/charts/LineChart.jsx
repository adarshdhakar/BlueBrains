import React from "react";
import { pointsToPath } from "./chartUtils";

export default function LineChart({ data = [], w = 320, h = 140 }) {
    const pad = 14;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * (w - pad * 2) + pad;
        const y = h - ((d - min) / (max - min || 1)) * (h - pad * 2) - pad;
        return [x, y];
    });
    const path = pointsToPath(pts);
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
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
        </svg>
    );
}
