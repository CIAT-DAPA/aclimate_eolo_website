import { useEffect, useRef, useState, memo, useContext } from "react";
import proj4 from "proj4";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import chroma from "chroma-js";
import AuthContext from "@/app/Context/auth/authContext";

window.proj4 = proj4;

const TiffLayer = ({ anomalies, setCurrentLoading }) => {
  const [layers, setLayers] = useState([]);
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();
  const prevAnomalies = useRef();

  const { user } = useContext(AuthContext);

  function normalizeValue(value, min, max) {
    return (value - min) / (max - min);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!anomalies || anomalies === prevAnomalies.current) {
      // Si no hay cambios en anomalies o ya se ejecutó una vez, no hacer nada
      return;
    }
    setCurrentLoading(true);
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
        user: user.user.user,
        passw: user.user.password,
      }),
    })
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        parseGeoraster(arrayBuffer).then((georaster) => {
          const min = -140; //georaster.mins[0];
          const range = georaster.ranges[0];
          const minValue = -3.0312385e-5;
          const maxValue = 4.544329e-5;
          const colorScale = chroma.scale([
            "#a08250",
            "#ffc64a",
            "#fff896",
            "#bcef9b",
            "#89ea54",
            "#87cc48",
            "#70ae48",
            "#5c9344",
            "#626d4b",
          ]);
          const options = {
            pixelValuesToColorFn: function (pixelValues) {
              const pixelValue = pixelValues[0];
              if (pixelValue === -9999) return null;
              let color = null;
              // const scaledPixelValue = normalizeValue(
              //   pixelValue,
              //   minValue,
              //   maxValue
              // );
              // const color = colorScale(scaledPixelValue).hex();
              if (pixelValue < -40) {
                color = "#a08250";
              } else if (pixelValue < -20) {
                color = "#ffc64a";
              } else if (pixelValue < 0) {
                color = "#fff896";
              } else if (pixelValue < 20) {
                color = "#bcef9b";
              } else if (pixelValue < 40) {
                color = "#89ea54";
              } else if (pixelValue < 60) {
                color = "#87cc48";
              } else if (pixelValue < 80) {
                color = "#70ae48";
              } else if (pixelValue < 100) {
                color = "#5c9344";
              } else if (pixelValue < 120) {
                color = "#626d4b";
              }
              return color;
            },
            resolution: 256,
            opacity: 1,
          };
          options.georaster = georaster;
          geoTiffLayerRef.current = new GeoRasterLayer(options);
          setLayers([...layers, geoTiffLayerRef.current]);
          container.addLayer(geoTiffLayerRef.current);
          setCurrentLoading(false);
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
