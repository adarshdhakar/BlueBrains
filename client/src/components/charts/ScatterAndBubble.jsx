import React from "react";
import { clamp } from "./chartUtils";

export function ScatterPlot({ data = [], width = 400, height = 160 }) {
    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
            <rect width="100%" height="100%" fill="transparent" />
            {data.map((s, i) => {
                const x = (s.x / 23) * (width - 40) + 20;
                const y = height - clamp(s.y, 0, 200);
                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={3 + (i % 3)}
                        fill="var(--accentBlue)"
                        fillOpacity="0.9"
                    />
                );
            })}
        </svg>
    );
}

export function BubblePlot({ data = [], width = 220, height = 140, palette = [] }) {
    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
            <rect x="0" y="0" width={width} height={height} fill="transparent" />
            {data.map((b, i) => {
                const x = (b.x / 110) * (width - 20) + 10;
                const y = height - (b.y / 110) * (height - 20);
                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={b.r}
                        fill={palette[i % palette.length]}
                        fillOpacity="0.92"
                    />
                );
            })}
        </svg>
    );
}

export default { ScatterPlot, BubblePlot };
