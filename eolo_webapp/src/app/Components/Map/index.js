"use client";
import { useRef } from "react";
import { MapContainer, TileLayer, WMSTileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ center, zoom, url, workspace, store, year, month }) => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{
        height: "100%",
        width: "85%",
        justifySelf: "center",
      }}
      zoomControl={true}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <WMSTileLayer
        key={
          workspace + ":" + store
        }
        layers={
          workspace + ":" + store
        }
        url={url+workspace+"/wms"}
        format={"image/png"}
        transparent={true}
        params={{ time: year + "-" + month }}
      />
    </MapContainer>
  );
};

export default Map;
