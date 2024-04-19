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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!anomalies || anomalies === prevAnomalies.current) {
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
          const min = -140; //georaster.mins[0];
          const range = georaster.ranges[0];
          const scale = chroma.scale("Spectral").domain([2, -2]);
          const options = {
            pixelValuesToColorFn: function (pixelValues) {
              const pixelValue = pixelValues[0];
              if (pixelValue === -9999) return null;
              //let color = null;
              const scaledPixelValue = (pixelValue - min) / 100;
              const color = scale(scaledPixelValue).hex();
              // if (pixelValue > 40 && pixelValue <= 60) {
              //   color = "#a08250";
              // } else if (pixelValue > 60 && pixelValue <= 80) {
              //   color = "#ffc64a";
              // } else if (pixelValue > 80 && pixelValue <= 100) {
              //   color = "#fff896";
              // } else if (pixelValue > 100 && pixelValue <= 120) {
              //   color = "#bcef9b";
              // } else if (pixelValue > 120 && pixelValue <= 140) {
              //   color = "#89ea54";
              // } else if (pixelValue > 140 && pixelValue <= 160) {
              //   color = "#87cc48";
              // } else if (pixelValue > 160 && pixelValue <= 180) {
              //   color = "#70ae48";
              // } else if (pixelValue > 180 && pixelValue <= 200) {
              //   color = "#5c9344";
              // } else if (pixelValue > 200 && pixelValue <= 220) {
              //   color = "#626d4b";
              // }
              return color;
            },
            resolution: 256,
            opacity: 0.7,
          };
          options.georaster = georaster;
          geoTiffLayerRef.current = new GeoRasterLayer(options);
          setLayers([...layers, geoTiffLayerRef.current]);
          container.addLayer(geoTiffLayerRef.current);
        });
      });
  }, [anomalies]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
