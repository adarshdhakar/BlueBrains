import React from "react";
import { pointsToPath } from "./chartUtils";

export default function MixedBarLine({ bars = [], line = [], w = 700, h = 220 }) {
    const pad = 40;
    const bw = (w - pad * 2) / (bars.length || 1) - 8;
    const maxBar = Math.max(...bars, 1);
    const maxLine = Math.max(...line, 1);
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="mbar2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--barSecondary)" />
                    <stop offset="100%" stopColor="var(--barPrimary)" />
                </linearGradient>
            </defs>

            {bars.map((v, i) => {
                const barH = (v / maxBar) * (h - pad - 20);
                const x = pad + i * (bw + 8);
                const y = h - pad - barH;
                return (
                    <rect
                        key={`b-${i}`}
                        x={x}
                        y={y}
                        width={bw}
                        height={barH}
                        rx="3"
                        fill="url(#mbar2)"
                    />
                );
            })}

            {(() => {
                const pts = line.map((v, i) => {
                    const x =
                        pad + i * ((w - pad * 2) / (line.length - 1 || 1));
                    const y = h - pad - (v / maxLine) * (h - pad - 20);
                    return [x, y];
                });
                return (
                    <path
                        d={pointsToPath(pts)}
                        fill="none"
                        stroke="var(--accentBlue)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                );
            })()}
        </svg>
    );
}
