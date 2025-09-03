// chartUtils.js
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const pointsToPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

export const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

export const pieSlicePath = (cx, cy, r, startAngle, endAngle) => {
    const [x1, y1] = polarToCartesian(cx, cy, r, endAngle);
    const [x0, y0] = polarToCartesian(cx, cy, r, startAngle);
    const laf = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${laf} 1 ${x1} ${y1} Z`;
};
