"use client";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geotiff";
import TiffLayer from "./TiffLayer";

const Map = ({
  center,
  zoom,
  url,
  workspace,
  store,
  year,
  month,
  anomalies = null,
  isAnomalies = false,
}) => {
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
      ref={mapRef}
      zoomControl={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {isAnomalies ? (
        anomalies ? (
          <LayersControl.Overlay id={"epa"} name="epa">
            <TiffLayer anomalies={anomalies} />
          </LayersControl.Overlay>
        ) : (
          <></>
        )
      ) : (
        <WMSTileLayer
          key={workspace + ":" + store}
          layers={workspace + ":" + store}
          url={url + workspace + "/wms"}
          format={"image/png"}
          transparent={true}
          params={{ time: year + "-" + month }}
        />
      )}
    </MapContainer>
  );
};

export default Map;
