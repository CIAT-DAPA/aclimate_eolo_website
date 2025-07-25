"use client";
import { useState, useEffect, useRef, useContext } from "react";
import styles from "./page.module.css";
import {
  FormControl,
  OutlinedInput,
  Button,
  Box,
  IconButton,
  Select,
  InputLabel,
  Card,
  Container,
  Typography,
  Tooltip,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MenuItem from "@mui/material/MenuItem";
import Configuration from "@/app/config";
import MultiSelect from "@/app/Components/MultiSelect";
import axios from "axios";
import dynamic from "next/dynamic";
import Loading from "../Components/Loading";
import LoadingOverlay from "../Components/LoadingOverlay";
import ImageIcon from "@mui/icons-material/Image";

const Map = dynamic(() => import("@/app/Components/Map"), { ssr: false });

const RainfallChart = dynamic(() => import("../Components/RainfallChart"), {
  ssr: false,
});

export default function Home() {
  const [selectedYearHc, setSelectedYearHc] = useState("");
  const [selectedMonthC, setSelectedMonthC] = useState("");
  const [anomalies, setAnomalies] = useState(null);
  const [average, setAverage] = useState(null);
  const [currentLoading, setCurrentLoading] = useState(false);
  const [currentLoadingChart, setCurrentLoadingChart] = useState(false);
  const [tiff, setTiff] = useState(null);
  const [tiff2, setTiff2] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("Honduras");
  const climatologyRef = useRef(null);
  const historicalRef = useRef(null);
  const anomaliesRef = useRef(null);
  const averageRef = useRef(null);
  const [multiSelectData, setMultiSelectData] = useState([]);

  const [years, setYears] = useState([]);
  const [multYears, setMultYears] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState("prec");
  const [lastMonth, setLastMonth] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [newWorkspace, setNewWorkspace] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [colors, setColors] = useState([]);

  const [months, setMonths] = useState([
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]);

  const [monthsC, setMonthsC] = useState([
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]);

  // Función general para manejar el cambio en cualquier select
  const handleSelectChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const createAnomaly = async (e) => {
    setAnomalies({
      url: `${Configuration.get_api_url()}subtract_rasters`,
      month: selectedMonthC,
      years: multiSelectData,
    });

    setAverage({
      url: `${Configuration.get_api_url()}subtract_rasters`,
      month: selectedMonthC,
      years: multiSelectData,
      anomalie: false,
    });
  };

  const downloadRaster = () => {
    const link = document.createElement("a");
    const url = `${Configuration.get_geoserver_url()}${Configuration.get_climatology_worspace(
      newWorkspace
    )}/wms?service=WMS&version=1.1.0&time=2000-${selectedMonthC}&request=GetMap&layers=${Configuration.get_climatology_worspace(
      newWorkspace
    )}%3A${getSelectedStore()}&bbox=-93.0%2C5.999999739229679%2C-56.9999994635582%2C23.5&width=768&height=373&srs=EPSG%3A4326&styles=&format=image%2Fgeotiff`;
    link.href = url;
    link.download = `PromedioClimatico_${monthsC[selectedMonthC - 1]}.tif`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 0);
  };

  const downloadRasterHc = () => {
    const link = document.createElement("a");
    const url = `${Configuration.get_geoserver_url()}${Configuration.get_historical_worspace(
      newWorkspace
    )}/wms?service=WMS&version=1.1.0&time=${selectedYearHc}-${selectedMonthC}&request=GetMap&layers=${Configuration.get_historical_worspace(
      newWorkspace
    )}%3A${getSelectedStore(
      true
    )}&bbox=-93.0%2C5.999999739229679%2C-56.9999994635582%2C23.5&width=768&height=373&srs=EPSG%3A4326&styles=&format=image%2Fgeotiff`;
    link.href = url;
    link.download = `HistoricoC_${selectedYearHc}_${
      monthsC[selectedMonthC - 1]
    }.tif`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 0);
  };

  const downloadAnomalyRaster = () => {
    const link = document.createElement("a");
    link.href = tiff;
    link.download = `Anomalía_${
      monthsC[selectedMonthC - 1]
    }_${multiSelectData.join("-")}.tif`;

    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 0);
  };

  const downloadAnomalyRaster2 = () => {
    const link = document.createElement("a");
    link.href = tiff2;
    link.download = `Promedio_${
      monthsC[selectedMonthC - 1]
    }_${multiSelectData.join("-")}.tif`;

    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 0);
  };

  const getBarColors = () => {
    return months.map((month, index) =>
      index + 1 === selectedMonthC ? "#007bff" : "#b5cee8"
    );
  };

  async function getDatesFromGeoserver(workspace, layer) {
    const url = `${Configuration.get_geoserver_url()}${workspace}/wms?service=WMS&version=1.3.0&request=GetCapabilities`;
    const response = await axios.get(url);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const layers = xmlDoc.getElementsByTagName("Layer");
    let dates;

    for (let i = 0; i < layers.length; i++) {
      const layerName = layers[i].getElementsByTagName("Name")[0].textContent;
      if (layerName === layer) {
        const dimension =
          layers[i].getElementsByTagName("Dimension")[0].textContent;
        const timeInterval = dimension.split(",");
        dates = timeInterval.map((date) => date.split("T")[0].slice(0, -3));
        break;
      }
    }
    return dates;
  }

  const fetchDepartmentMonthlyAverages = async () => {
    try {
      const endpoint = `${Configuration.get_api_url()}department_monthly_averages`;
      const workspace = Configuration.get_cenaos_worspace();

      const payload = {
        workspace,
      };

      const response = await axios.post(endpoint, payload);
      const rawDepartments = response.data;

      const rainfallData = {};
      const departments = [];

      for (const [originalName, monthlyValues] of Object.entries(
        rawDepartments
      )) {
        const depKey = originalName;

        departments.push(depKey);

        const values = monthlyValues.map((item) =>
          item && item.average != null && !isNaN(item.average)
            ? parseFloat(item.average.toFixed(2))
            : null
        );

        rainfallData[depKey] = values;
      }

      return {
        year: response.data.year,
        departments,
        rainfallData,
      };
    } catch (error) {
      console.error("Error fetching department monthly averages:", error);
      throw error;
    }
  };

  const getSelectedStore = (monthly = false) => {
    switch (selectedVariable) {
      case "prec":
        if (monthly) {
          return Configuration.get_prec_monthly_store();
        } else {
          return Configuration.get_prec_store();
        }

      case "tmax":
        return Configuration.get_tmax_store();
      case "tmin":
        return Configuration.get_tmin_store();
      default:
        return Configuration.get_prec_store();
    }
  };

  const handleVariableChange = (event) => {
    setSelectedVariable(event.target.value);
  };

  // Función para determinar el zoom basado en el tamaño de pantalla
  const getMapZoom = () => {
    return isMobile ? 6 : 7;
  };

  // Función para determinar el minZoom basado en el tamaño de pantalla
  const getMinZoom = () => {
    return isMobile ? 6 : 8;
  };

  useEffect(() => {
    getDatesFromGeoserver(
      Configuration.get_historical_worspace(newWorkspace),
      getSelectedStore(true)
    ).then((dates) => {
      const uniqueYears = [...new Set(dates.map((date) => date.split("-")[0]))];
      const currentYear = new Date().getFullYear();
      setYears(uniqueYears);
      setMultYears(uniqueYears);
      //setMultYears(uniqueYears.filter(year => year != currentYear))
      setLastMonth(parseInt(dates[dates.length - 1].split("-")[1]));
    });
  }, []);

  useEffect(() => {
    const getDepartmentsData = async () => {
      try {
        setCurrentLoadingChart(true);
        const { rainfallData, departments } =
          await fetchDepartmentMonthlyAverages();
        setDepartmentsData(rainfallData);
        setDepartments(departments);
        setSelectedDepartment(departments[0]);
        setCurrentLoadingChart(false);
      } catch (err) {
        setCurrentLoadingChart(false);
        console.log(err);
      }
    };

    getDepartmentsData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedYearHc == years[years.length - 1]) {
      const filteredMonths = months.slice(0, lastMonth);
      setMonths(filteredMonths);
    } else {
      if (months.length != monthsC.length) {
        setMonths([...monthsC]);
      }
    }
  }, [selectedYearHc]);

  useEffect(() => {
    setColors([...getBarColors()]);
  }, [selectedMonthC]);

  useEffect(() => {
    if (selectedVariable == "prec") {
      setNewWorkspace(true);
    } else {
      setNewWorkspace(false);
    }
  }, [selectedVariable]);

  // Detectar cambios de viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Establecer el estado inicial
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <Container className={styles.main} maxWidth={false} disableGutters>
      <Box className={styles.country_container}>
        <FormControl
          sx={{
            m: 1,
            minWidth: 60,
            width: { xs: "90%", sm: "200px", md: "15%" },
          }}
          size="small"
        >
          <InputLabel id="select_country">{"Seleccione el país"}</InputLabel>
          <Select
            labelId="select_country"
            input={
              <OutlinedInput
                label={"Seleccione el país"}
                value={selectedCountry}
                onChange={handleSelectChange(setSelectedCountry)}
              />
            }
          >
            <MenuItem value={"Honduras"}>{"Honduras"}</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          sx={{
            m: 1,
            minWidth: 120,
            width: { xs: "90%", sm: "200px", md: "auto" },
          }}
          size="small"
        >
          <InputLabel id="select-variable">Variable</InputLabel>
          <Select
            labelId="select-variable"
            value={selectedVariable}
            onChange={handleVariableChange}
            input={<OutlinedInput label="Variable" />}
          >
            <MenuItem value="prec">Precipitación</MenuItem>
            <MenuItem value="tmax">Temperatura Máxima</MenuItem>
            <MenuItem value="tmin">Temperatura Mínima</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className={styles.title_analogues_container}>
        <h1>Análogos</h1>
        <p className={styles.title_analogues_text}>
          {`El módulo de análogos es una herramienta dentro de nuestra plataforma que te permite mejorar la precisión de tus pronósticos climáticos al identificar y analizar patrones climáticos pasados que son análogos o similares al presente.
              `}
        </p>
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Typography
            variant="body1"
            style={{ padding: "0 1%", color: "#0d2137" }}
          >
            Seleccione el mes que desea comparar:
          </Typography>
          <FormControl
            sx={{
              m: 1,
              minWidth: 60,
              width: { xs: "90%", sm: "80%", md: "80%" },
            }}
            size="small"
          >
            <InputLabel id="select_month">{"Seleccione un mes"}</InputLabel>
            <Select
              labelId="select_month"
              input={
                <OutlinedInput
                  label={"Seleccione un mes"}
                  value={selectedMonthC}
                  onChange={handleSelectChange(setSelectedMonthC)}
                />
              }
            >
              {monthsC.map((d, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className={styles.title_analogues_container}>
        <h2>Promedio de la lluvia acumulada en cada mes por departamento</h2>
        <p className={styles.title_analogues_text}>
          {`La herramienta hace el calculo del promedio o norma climática de la lluvia acumulada en cada mes, por cada departamento de Honduras entre 1990 y 2020. Esta información nos permite visualizar el ciclo anual de las lluvias y comparar con pronósticos estacionales. Debido a que es un promedio mensual por departamento, se sugiere considerar otras herramientas disponibles para la estimación del promedio a escalas territoriales más pequeñas, como son los municipios.
              `}
        </p>
        <Box style={{ width: "100%" }}>
          <RainfallChart
            months={monthsC}
            departments={departments}
            rainfallData={departmentsData}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            colors={colors}
            currentLoadingChart={currentLoadingChart}
          />
        </Box>
      </div>

      <Box className={styles.map_container}>
        <div className={styles.historical_map}>
          <div className={styles.info_container}>
            <h2>Promedio de histórico climático</h2>
            <p>
              {
                "La herramienta calcula el promedio histórico de la variable seleccionada durante esos años. Esto proporciona una referencia adicional para evaluar los comportamientos históricos. En el siguiente mapa podrá ver los datos promedios históricos de la variable seleccionada de un mes seleccionado."
              }
            </p>
          </div>

          <Card
            ref={climatologyRef}
            sx={{ minHeight: { xs: "350px", md: "400px" } }}
          >
            <Map
              className={styles.map}
              style={{
                width: "100%",
                height: "100%",
                justifySelf: "center",
                display: "flex",
                justifyContent: "flex-start",
                minHeight: "300px",
              }}
              zoom={getMapZoom()}
              center={[14.5007343, -86.6719949]}
              url={Configuration.get_geoserver_url()}
              workspace={Configuration.get_climatology_worspace(newWorkspace)}
              store={getSelectedStore()}
              year={2000}
              month={selectedMonthC}
              child={
                <Box className={styles.map_buttons_container}>
                  <Tooltip title="Descargar raster">
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      className={styles.download_raster_l}
                      disabled={!selectedMonthC}
                      onClick={downloadRaster}
                    >
                      <FileDownloadOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar png">
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      className={styles.download_raster_l}
                      disabled={!selectedMonthC}
                      onClick={async () => {
                        const { exportComponentAsPNG } = await import(
                          "react-component-export-image"
                        );

                        exportComponentAsPNG(climatologyRef, {
                          fileName: `Promedio_histórico_${
                            monthsC[selectedMonthC - 1]
                          }.png`,
                        });
                      }}
                    >
                      <ImageIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </Card>
        </div>

        <div className={styles.historical_map}>
          <div className={styles.info_container}>
            <h2>Consultar históricos climáticos</h2>
            <p>
              {
                "En esta sección usted podrá analizar los datos históricos climáticos observados sobre la variable seleccionada. En el siguiente mapa podrá ver los datos de la variable seleccionada de un mes y año que haya seleccionado."
              }
            </p>
            <Typography
              variant="body1"
              style={{ padding: "0 1%", color: "#0d2137", margin: 0 }}
            >
              Seleccione el año que desea consultar:
            </Typography>
            <FormControl
              sx={{
                m: 1,
                minWidth: 60,
                width: { xs: "90%", sm: "40%", md: "40%" },
              }}
              size="small"
            >
              <InputLabel id="select_year_hc">{"Seleccione el año"}</InputLabel>
              <Select
                labelId="select_year_hc"
                disabled={!(selectedMonthC != "")}
                input={
                  <OutlinedInput
                    label={"Seleccione el año"}
                    value={selectedYearHc}
                    onChange={handleSelectChange(setSelectedYearHc)}
                  />
                }
              >
                {years.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Card
            ref={historicalRef}
            sx={{ minHeight: { xs: "350px", md: "400px" } }}
          >
            <Map
              className={styles.map}
              style={{
                width: "100%",
                height: "100%",
                justifySelf: "center",
                display: "flex",
                justifyContent: "flex-start",
                minHeight: "300px",
              }}
              zoom={getMapZoom()}
              center={[14.5007343, -86.6719949]}
              url={Configuration.get_geoserver_url()}
              workspace={Configuration.get_historical_worspace(newWorkspace)}
              store={getSelectedStore(true)}
              year={selectedYearHc}
              month={selectedMonthC}
              child={
                <Box className={styles.map_buttons_container}>
                  <Tooltip title="Descargar raster">
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      className={styles.download_raster_l}
                      disabled={!selectedYearHc}
                      onClick={downloadRasterHc}
                    >
                      <FileDownloadOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar png">
                    <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                      className={styles.download_raster_l}
                      disabled={!selectedYearHc}
                      onClick={async () => {
                        const { exportComponentAsPNG } = await import(
                          "react-component-export-image"
                        );

                        exportComponentAsPNG(historicalRef, {
                          fileName: `Histórico_${selectedYearHc}_${
                            monthsC[selectedMonthC - 1]
                          }.png`,
                        });
                      }}
                    >
                      <ImageIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </Card>
        </div>

        <div className={styles.anomalies_map}>
          <div className={styles.info_container}>
            <h2>Anomalía</h2>
            <p>
              {`Nuestra herramienta de análisis de anomalías climáticas emplea el método de promedio de años análogos y evalúa las desviaciones significativas en las condiciones climáticas respecto a la norma histórica. Estas evaluaciones se realizan utilizando datos de CHIRPSv3 beta, con las anomalías normalizadas para una mejor interpretación de los resultados.
                   Explora nuestro mapa interactivo para visualizar estas anomalías climáticas.`}
            </p>

            <div className={styles.anomalies_but_cont}>
              <Box sx={{ width: { xs: "90%", md: "60%" } }}>
                <Typography
                  variant="body1"
                  style={{ padding: "0 1%", color: "#0d2137" }}
                >
                  Seleccione los años analogos para calcular el promedio:
                </Typography>
                <MultiSelect
                  arrayData={multYears}
                  label={"Seleccione los años análogos"}
                  data={multiSelectData}
                  setData={setMultiSelectData}
                  disabled={!(selectedMonthC != "")}
                />
              </Box>

              <Button
                sx={{
                  width: { xs: "55%", sm: "auto", md: "16%" },
                  maxWidth: { xs: "180px", sm: "none" },
                  backgroundColor: "#e37b13",
                  color: "#ffff",
                  marginRight: { xs: "0", md: "2%" },
                  minWidth: "120px",
                  mt: { xs: 1, md: 0 },
                  alignSelf: { xs: "center", md: "flex-start" },
                }}
                onClick={createAnomaly}
                disabled={multiSelectData.length < 2}
              >
                Calcular
              </Button>
            </div>
          </div>
          <Box className={styles.anomalies_average_container}>
            <Card
              className={styles.card_map}
              ref={averageRef}
              sx={{ minHeight: { xs: "350px", md: "400px" } }}
            >
              <Typography
                variant="h6"
                className={styles.card_title}
                style={{ color: "#0d2137" }}
              >
                Promedio de los años seleccionados:
              </Typography>
              <Map
                className={styles.map}
                style={{
                  width: "100%",
                  height: "95%",
                  justifySelf: "center",
                  display: "flex",
                  justifyContent: "flex-start",
                  minHeight: "300px",
                }}
                zoom={getMapZoom()}
                center={[14.5007343, -86.6719949]}
                anomalies={average}
                isAnomalies={true}
                setCurrentLoading={setCurrentLoading}
                workspace={Configuration.get_historical_worspace(newWorkspace)}
                store={Configuration.get_prec_monthly_store()}
                minZoom={getMinZoom()}
                setTiff={setTiff2}
                child={
                  <Box className={styles.map_buttons_container}>
                    <Tooltip title="Descargar raster">
                      <IconButton
                        color="primary"
                        aria-label="add to shopping cart"
                        className={styles.download_raster_l}
                        disabled={!tiff2}
                        onClick={downloadAnomalyRaster2}
                      >
                        <FileDownloadOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Descargar png">
                      <IconButton
                        color="primary"
                        aria-label="add to shopping cart"
                        className={styles.download_raster_l}
                        disabled={!tiff2}
                        onClick={async () => {
                          const { exportComponentAsPNG } = await import(
                            "react-component-export-image"
                          );
                          exportComponentAsPNG(averageRef, {
                            fileName: `Promedio_${
                              monthsC[selectedMonthC - 1]
                            }_${multiSelectData.join("-")}.png`,
                          });
                        }}
                      >
                        <ImageIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </Card>

            <Card
              className={styles.card_map}
              ref={anomaliesRef}
              sx={{ minHeight: { xs: "350px", md: "400px" } }}
            >
              <Typography
                variant="h6"
                className={styles.card_title}
                style={{ color: "#0d2137" }}
              >
                Anomalía normalizada:
              </Typography>
              <Map
                className={styles.map}
                style={{
                  width: "100%",
                  height: "95%",
                  justifySelf: "center",
                  display: "flex",
                  justifyContent: "flex-start",
                  minHeight: "300px",
                }}
                zoom={getMapZoom()}
                center={[14.5007343, -86.6719949]}
                anomalies={anomalies}
                isAnomalies={true}
                setCurrentLoading={setCurrentLoading}
                workspace={Configuration.get_cenaos_worspace()}
                store={Configuration.get_anomalies_style()}
                minZoom={getMinZoom()}
                setTiff={setTiff}
                child={
                  <Box className={styles.map_buttons_container}>
                    <Tooltip title="Descargar raster">
                      <IconButton
                        color="primary"
                        aria-label="add to shopping cart"
                        className={styles.download_raster_l}
                        disabled={!tiff}
                        onClick={downloadAnomalyRaster}
                      >
                        <FileDownloadOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Descargar png">
                      <IconButton
                        color="primary"
                        aria-label="add to shopping cart"
                        className={styles.download_raster_l}
                        disabled={!tiff}
                        onClick={async () => {
                          const { exportComponentAsPNG } = await import(
                            "react-component-export-image"
                          );
                          exportComponentAsPNG(anomaliesRef, {
                            fileName: `Anomalía_${
                              monthsC[selectedMonthC - 1]
                            }_${multiSelectData.join("-")}.png`,
                          });
                        }}
                      >
                        <ImageIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </Card>
          </Box>
        </div>
      </Box>
      {currentLoading && <LoadingOverlay />}
    </Container>
  );
}
