import React from "react";
import { polarToCartesian } from "./chartUtils";

export default function RadarChart({ axes = [], values = [], size = 180 }) {
    const cx = size / 2,
        cy = size / 2,
        r = size / 2 - 18;
    const step = 360 / (axes.length || 1);
    const max = Math.max(...values, 1);
    const axisPts = axes.map((_, i) => polarToCartesian(cx, cy, r, i * step));
    const valuePts = values.map((v, i) =>
        polarToCartesian(cx, cy, (v / max) * r, i * step)
    );
    return (
        <svg width="100%" viewBox={`0 0 ${size} ${size}`}>
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
            <polygon
                points={axisPts.map((p) => p.join(",")).join(" ")}
                fill="transparent"
                stroke="var(--border)"
                strokeWidth="0.6"
            />
            <polygon
                points={valuePts.map((p) => p.join(",")).join(" ")}
                fill="var(--accentGreen)"
                fillOpacity="0.14"
                stroke="var(--accentGreen)"
                strokeWidth="1.2"
            />
            {axes.map((a, i) => {
                const label = polarToCartesian(cx, cy, r + 14, i * step);
                return (
                    <text
                        key={i}
                        x={label[0]}
                        y={label[1]}
                        fontSize="11"
                        fill="var(--subtext)"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {a}
                    </text>
                );
            })}
        </svg>
    );
}
