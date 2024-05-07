import { useEffect, useState } from "react";
import Configuration from "@/app/config";
import "leaflet/dist/leaflet.css";
import styles from "./map_layer.module.css";

function MapLegend({ workspace, layer }) {
  const [photo, setPhoto] = useState();
  const [legend, setLegend] = useState("Cantidad mm/mes");

  useEffect(() => {
    const image = `${Configuration.get_geoserver_url()}${workspace}/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER=${workspace}:${layer}&Transparent=True&LEGEND_OPTIONS=dx:3;fontName:Helvetica`;
    setPhoto(image);

    if (layer === Configuration.get_prec_store()) {
      setLegend("Cantidad mm/mes");
    } else if (layer === Configuration.get_anomalies_style()) {
      setLegend("Anomalia %");
    } else if (
      layer === Configuration.get_above_store() ||
      layer === Configuration.get_below_store() ||
      layer === Configuration.get_normal_store() ||
      layer === Configuration.get_dominant_store()
    ) {
      setLegend("Probabilidad %");
    } else {
      setLegend("Temperatura promedio mensual °C");
    }
  }, [workspace, layer]);

  return (
    <div className={"leaflet-bottom leaflet-right"}>
      <div className="leaflet-control leaflet-bar">
        {layer && (
          <div className={[styles.info, styles.legend].join(" ")}>
            <h6>{legend}</h6>

            <img src={photo} alt="map legend"></img>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapLegend;
