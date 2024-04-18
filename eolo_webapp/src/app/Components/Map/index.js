"use client";
import { useRef } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geotiff";
import TiffLayer from "./TiffLayer";
import MapLegend from "../MapLayer";

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
        width: "92%",
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
      ) : year && month && store && workspace ? (
        <>
          <WMSTileLayer
            key={workspace + ":" + store}
            layers={workspace + ":" + store}
            url={url + workspace + "/wms"}
            format={"image/png"}
            transparent={true}
            params={{ time: year + "-" + month }}
          />
          <MapLegend workspace={workspace} layer={store} />
        </>
      ) : (
        <></>
      )}
    </MapContainer>
  );
};

export default Map;
