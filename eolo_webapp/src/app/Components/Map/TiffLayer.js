import { useEffect, useRef, useState, memo, useContext } from "react";
import proj4 from "proj4";
import { useLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import { toast } from "react-toastify";
import AuthContext from "@/app/Context/auth/authContext";

window.proj4 = proj4;

const TiffLayer = ({ anomalies, setCurrentLoading, setTiff }) => {
  const [layers, setLayers] = useState([]);
  const geoTiffLayerRef = useRef();
  const context = useLeafletContext();
  const map = useMap();
  const prevAnomalies = useRef();

  const { user } = useContext(AuthContext);

  const notify = (text, type) => {
    if (type == "error") {
      toast.error(text, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    } else {
      toast(text, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
      });
    }
  };

  const getAnomalies = async () => {
    try{
      setCurrentLoading(true);
      const container = context.map;
      prevAnomalies.current = anomalies;
      const url = anomalies.url; // Reemplaza con la URL de tu archivo GeoTIFF
      const response = await fetch(url, {
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
      });
  
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer]);
      setTiff(URL.createObjectURL(blob));
      parseGeoraster(arrayBuffer).then((georaster) => {
        const options = {
          pixelValuesToColorFn: function (pixelValues) {
            const pixelValue = pixelValues[0];
            if (pixelValue === -9999) return null;
            let color = null;
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
    }catch(error){
      setCurrentLoading(false);
      notify("Error al generar la anomalia", "error")
    }
    
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!anomalies || anomalies === prevAnomalies.current) {
      // Si no hay cambios en anomalies o ya se ejecutó una vez, no hacer nada
      return;
    }
    getAnomalies();
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
