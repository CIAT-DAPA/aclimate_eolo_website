import { useEffect, useRef, useState, memo } from "react";
import proj4 from "proj4";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import chroma from "chroma-js";

window.proj4 = proj4;

const TiffLayer = ({ anomalies }) => {
  const [layers, setLayers] = useState([]);
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();
  const prevAnomalies = useRef();

  useEffect(() => {
    if (!anomalies || (anomalies === prevAnomalies.current)) {
      // Si no hay cambios en anomalies o ya se ejecutó una vez, no hacer nada
      return;
    }
    const container = context.map;
    prevAnomalies.current = anomalies;
    const url = anomalies.url; // Reemplaza con la URL de tu archivo GeoTIFF
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        month: anomalies.month,
        years: anomalies.years,
      }),
    })
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        parseGeoraster(arrayBuffer).then((georaster) => {
          const min = -140 //georaster.mins[0];
          const range = georaster.ranges[0];
          const scale = chroma.scale("Spectral").domain([2, -2]);
          const options = {
            pixelValuesToColorFn: function (pixelValues) {
              const pixelValue = pixelValues[0];
              if (pixelValue === -9999) return null;
              const scaledPixelValue = (pixelValue - min) / 100;
              const color = scale(scaledPixelValue).hex();
              return color;
            },
            resolution: 256,
            opacity: 0.7,
          };
          options.georaster = georaster;
          geoTiffLayerRef.current = new GeoRasterLayer(options);
          console.log(georaster)
          setLayers([...layers, geoTiffLayerRef.current]);
          container.addLayer(geoTiffLayerRef.current);
        });
      });
  }, [anomalies]);

  useEffect(() => {

    if (layers.length > 1) {
      const container = context.map;
      for (let index = 0; index < layers.length - 1; index++) {
        container.removeLayer(layers[index]);
      }
      setLayers([layers[layers.length - 1]]);
    }
  }, [layers]);

  return null;
};

export default memo(TiffLayer);
