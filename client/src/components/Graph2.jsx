import React, { useRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import indiaData from "../assets/india.json";

// --- Color Palettes (Centralized here for this component) ---
const darkColors = {
  bg: "rgb(11, 22, 44)",
  card: "rgb(18, 32, 58)",
  accentBlue: "rgb(6, 165, 225)",
  darkBlue: "rgb(10, 40, 120)",
};

const lightColors = {
  bg: "rgb(248, 250, 252)",
  border: "rgba(15, 23, 42, 0.1)",
  midBlue: "rgb(200, 220, 255)",
};

// --- Helper: Create Custom Marker Icon ---
const createCustomIcon = (color) => {
  // Fix for default icon path issue with bundlers like Vite/Webpack
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px ${color};"></div>`,
    className: "custom-marker-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// --- Main Graph Component ---
const Graph = ({ theme = "dark", heatmapData = [], reportsData = [] }) => {
  const isDark = theme === "dark";
  const mapRef = useRef(null);
  const heatRef = useRef(null);

  const heatGradient = useMemo(
    () => ({
      0.0: "#08306b",
      0.12: "#2c7bb6",
      0.3: "#7fcdbb",
      0.5: "#ffffbf",
      0.7: "#fdae61",
      0.88: "#d7191c",
      1.0: "#800026",
    }),
    []
  );

  const indiaBounds = useMemo(() => {
    const geoJsonLayer = L.geoJSON(indiaData);
    return geoJsonLayer.getBounds().pad(1);
  }, []);

  const geoJsonStyle = useMemo(
    () =>
      isDark
        ? {
            color: darkColors.accentBlue,
            weight: 1,
            fillColor: darkColors.darkBlue,
            fillOpacity: 0.6,
          }
        : {
            color: lightColors.border,
            weight: 1.5,
            fillColor: lightColors.midBlue,
            fillOpacity: 0.7,
          },
    [isDark]
  );

  const tileLayer = useMemo(
    () =>
      isDark
        ? {
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            attribution:
              '&copy; <a href="https://carto.com/attributions">CARTO</a>',
          }
        : {
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            attribution:
              '&copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
    [isDark]
  );

  // Effect to manage the heatmap layer
  useEffect(() => {
    if (!mapRef.current || !L.heatLayer) return;

    const heatPoints = (heatmapData || [])
      .filter((p) => p && typeof p[0] === "number" && typeof p[1] === "number")
      .map((p) => [p[0], p[1], Math.max(0, Math.min(1, p[2] || 0.5))]);

    if (heatRef.current) {
      heatRef.current.remove();
    }

    if (heatPoints.length > 0) {
      heatRef.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 18,
        maxZoom: 10,
        gradient: heatGradient,
        minOpacity: 0.2,
      }).addTo(mapRef.current);
    }
  }, [heatmapData, heatGradient]);

  return (
    <MapContainer
      style={{
        height: "100%",
        width: "100%",
        background: isDark ? darkColors.bg : lightColors.bg,
      }}
      center={[22.97, 78.65]}
      zoom={4}
      zoomControl={false}
      attributionControl={false}
      maxBounds={indiaBounds}
      minZoom={2}
      whenCreated={(map) => {
        mapRef.current = map;
        map.fitBounds(indiaBounds);
      }}
    >
      <TileLayer {...tileLayer} />
      <GeoJSON data={indiaData} style={geoJsonStyle} />

      {/* Markers generated from reportsData */}
      {reportsData.map((report, index) => {
        const location = report.location;
        if (
          !location ||
          typeof location.latitude !== "number" ||
          typeof location.longitude !== "number"
        ) {
          return null;
        }

        const intensity = (100 - report.credibility_score) / 100.0;
        const color =
          intensity >= 0.9
            ? "#d7191c"
            : intensity >= 0.7
            ? "#fdae61"
            : intensity >= 0.4
            ? "#ffffbf"
            : intensity >= 0.15
            ? "#7fcdbb"
            : "#2c7bb6";

        return (
          <Marker
            key={report.id || `report-${index}`} // Use a unique ID from Firestore if available
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon(color)}
          >
            <Popup className="custom-popup">
              <div
                style={{
                  color: isDark ? "white" : "black",
                  backgroundColor: isDark ? darkColors.card : "white",
                  padding: "1px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${
                    isDark ? darkColors.border : lightColors.border
                  }`,
                }}
              >
                <p className="font-semibold text-sm">{report.category}</p>
                <p className="text-xs">{report.report_summary}</p>
                <p className="text-xs font-bold">
                  Credibility: {report.credibility_score}%
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Graph;
