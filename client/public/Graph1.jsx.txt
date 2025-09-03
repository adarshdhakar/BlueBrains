import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import indiaData from "../assets/india.json";
import { useRef, useEffect } from "react";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
const Graph = () => {
  const mapRef = useRef();

  useEffect(() => {
    const map = mapRef.current;
    if (map && indiaData) {
      const geoJsonLayer = L.geoJSON(indiaData);
      map.fitBounds(geoJsonLayer.getBounds()); // Zoom to India
    }
  }, []);

  return (
    <MapContainer
      ref={mapRef}
      style={{ height: "100vh", width: "100%" }}
      zoom={5}
      center={[22.97, 78.65]} // India center
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSON
        data={indiaData}
        style={() => ({
          color: "black",
          weight: 2,
          fillColor: "#e0ffe0",
          fillOpacity: 0.5,
        })}
      />
    </MapContainer>
  );
};

export default Graph;
