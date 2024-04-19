import { useEffect, useState } from "react";
import Configuration from "@/app/config";
import "leaflet/dist/leaflet.css";
import styles from "./map_layer.module.css";
import Image from 'next/image'

function MapLegend({ workspace, layer }) {
  const [photo, setPhoto] = useState();
  const [legend, setLegend] = useState("Cantidad mm/mes");

  useEffect(() => {
    const image = `${Configuration.get_geoserver_url()}${workspace}/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=15&HEIGHT=15&LAYER=${workspace}:${layer}&Transparent=True&LEGEND_OPTIONS=dx:3;fontName:Helvetica`;
    setPhoto(image);

    if (layer === Configuration.get_prec_store()) {
      setLegend("Cantidad mm/mes");
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

            <Image src={photo} alt="map legend"></Image>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapLegend;
