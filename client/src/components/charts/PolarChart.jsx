import React from "react";
import { pieSlicePath } from "./chartUtils";

export default function PolarChart({ values = [], palette = [], size = 200 }) {
    return (
        <svg width="100%" viewBox={`0 0 ${size} ${size}`}>
            <g transform={`translate(${size / 2},${size / 2})`}>
                {values.map((v, i) => {
                    const start = (i / values.length) * 360;
                    const end = ((i + 1) / values.length) * 360;
                    const r = 20 + (v / 100) * (size / 2 - 20);
                    const p = pieSlicePath(0, 0, r, start, end);
                    return (
                        <path
                            key={i}
                            d={p}
                            fill={palette[i % palette.length]}
                            stroke="var(--card)"
                            strokeWidth="0.6"
                        />
                    );
                })}
            </g>
        </svg>
    );
}
