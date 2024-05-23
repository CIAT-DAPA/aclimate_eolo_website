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

  const getColor = (value) => {
    if (anomalies.anomalie != false) {
      if (value < -40) {
        return "#a08250";
      } else if (value < -20) {
        return "#ffc64a";
      } else if (value < 0) {
        return "#fff896";
      } else if (value < 20) {
        return "#bcef9b";
      } else if (value < 40) {
        return "#89ea54";
      } else if (value < 60) {
        return "#87cc48";
      } else if (value < 80) {
        return "#70ae48";
      } else if (value < 100) {
        return "#5c9344";
      } else if (value < 120) {
        return "#626d4b";
      }
    } else {
      if (value < 25.1) {
        return "#abe981";
      } else if (value < 50.1) {
        return "#abe981";
      } else if (value < 75.1) {
        return "#78cf54";
      } else if (value < 100.1) {
        return "#6db86f";
      } else if (value < 125.1) {
        return "#579e84";
      } else if (value < 150.1) {
        return "#5baba2";
      } else if (value < 200.1) {
        return "#8fccd7";
      } else if (value < 250.1) {
        return "#d5eeff";
      } else if (value < 275.1) {
        return "#9dddff";
      } else if (value < 300.1) {
        return "#67d0fe";
      } else if (value < 350.1) {
        return "#44abfe";
      } else if (value < 400.1) {
        return "#478dfb";
      } else if (value < 450.1) {
        return "#4d7cda";
      } else if (value < 500.1) {
        return "#4e70b6";
      } else if (value < 550.1) {
        return "#4c65a4";
      } else if (value < 600.1) {
        return "#5b539a";
      } else if (value < 650.1) {
        return "#75569b";
      } else if (value < 700.1) {
        return "#9d59ae";
      } else if (value < 750.1) {
        return "#d762ce";
      } else if (value < 850.1) {
        return "#f266c6";
      } else if (value < 950.1) {
        return "#ff6afb";
      } else if (value < 1050.1) {
        return "#ffbaf9";
      } else if (value < 1250.1) {
        return "#ffe5fd";
      } else if (value < 1500.1) {
        return "#eceae8";
      }
    }
  };

  const getAnomalies = async () => {
    try {
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
          anomalie: (typeof anomalies.anomalie !== 'undefined') ? anomalies.anomalie : true
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
            const color = getColor(pixelValue);
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
    } catch (error) {
      setCurrentLoading(false);
      notify("Error al generar la anomalia", "error");
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
