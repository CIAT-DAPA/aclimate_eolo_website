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
import Configuration from "@/app/config"

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
  setCurrentLoading = null,
  style = { width: "92%", height: "100%", justifySelf: "center" },
  child = null,
  childComponent = null,
}) => {
  const mapRef = useRef(null);

  const bounds = [
    [16.680277, -89.673874],
    [12.924146, -83.087018],
  ];

  const shapefile_workspace = "fc_cenaos_hn";
  const shapefile_layer = "CA_Norte_Cabeceras";

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style}
      ref={mapRef}
      zoomControl={true}
      maxBounds={bounds}
      minZoom={7}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <WMSTileLayer
        key={shapefile_workspace + ":" + shapefile_layer}
        layers={shapefile_workspace + ":" + shapefile_layer}
        url={Configuration.get_geoserver_url() + shapefile_workspace + "/wms"}
        format={"image/png"}
        transparent={true}
        zIndex={10000}
      />

      {child && (
        <LayersControl.Overlay
          position="topcenter"
          id="child_1"
          name="Controlador 1"
        >
          {child}
        </LayersControl.Overlay>
      )}

      {childComponent && (
        <LayersControl.Overlay
          position="topcenter"
          id="control"
          name="Controlador 2"
        >
          {childComponent}
        </LayersControl.Overlay>
      )}

      {isAnomalies ? (
        anomalies ? (
          <LayersControl.Overlay id={"anomalies"} name="Capa de Anomalia">
            <TiffLayer
              anomalies={anomalies}
              setCurrentLoading={setCurrentLoading}
            />
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
