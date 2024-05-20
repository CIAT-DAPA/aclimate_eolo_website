"use client";
import Loading from "../Components/Loading";
import dynamic from "next/dynamic";
import styles from "./report.module.css";
import { useState, useEffect, useContext } from "react";
import useAuth from "../Hooks/useAuth";
import Configuration from "../config";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import CsvTable from "../Components/Table";
import { usePDF } from "react-to-pdf";
import {
  OutlinedInput,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import LoadingOverlay from "../Components/LoadingOverlay";
import AuthContext from "@/app/Context/auth/authContext";
import { toast } from "react-toastify";

const Map = dynamic(() => import("@/app/Components/Map"), { ssr: false });

const ChartReport = dynamic(() => import("../Components/Chart"), {
  ssr: false,
});

const Report = () => {
  const { toPDF, targetRef } = usePDF({
    filename: "reporte_del_pronostico.pdf",
  });
  const { loading, auth } = useAuth();
  const { user } = useContext(AuthContext);
  const [forecastSelected, setForecastSelected] = useState("");
  const [data, setData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const [typeForecast, setTypeForecast] = useState("tri");
  const [currentLoading, setCurrentLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [monthsTitles, setMonthsTitles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [csv, setCsv] = useState(null);
  const [monthM, setMonthM] = useState("");
  const [yearM, setYearM] = useState("");
  const [titles, setTitles] = useState([
    "Localidad",
    "Temporada 1",
    "Temporada 2",
  ]);
  const [subTitles, setSubTitles] = useState([
    "Encima de lo normal",
    "Normal",
    "Debajo de lo normal",
  ]);
  const [workspaces, setWorkspaces] = useState([
    {
      display: "NextGen",
      value: Configuration.get_nextgen_worspace(),
      type: "tri",
    },
    {
      display: "AClimate",
      value: Configuration.get_aclimate_worspace(),
      type: "tri",
    },
    {
      display: "Análogos Automatizado",
      value: Configuration.get_analogues_worspace(),
      type: "tri",
    },
    {
      display: "Análogos",
      value: Configuration.get_cenaos_worspace(),
      type: "tri",
    },
  ]);

  const [averageData, setAverageData] = useState([]);

  const [average, setAverage] = useState([
    Configuration.get_above_store(),
    Configuration.get_normal_store(),
    Configuration.get_below_store(),
  ]);

  const [layers, setLayers] = useState([
    { display: "Encima de lo normal", value: Configuration.get_above_store() },
    { display: "Normal", value: Configuration.get_normal_store() },
    { display: "Debajo de lo normal", value: Configuration.get_below_store() },
    { display: "Dominante", value: Configuration.get_hgp_store() },
  ]);

  const cleanFilter = () => {
    setCsv(null);
    setSelectedFile(null);
  };

  const generateTitles = (seasons_data) => {
    const titles = ["Encima de lo normal", "Normal", "Debajo de lo normal"];

    const result = [];

    Object.keys(seasons_data).forEach((s) => result.push(titles));

    return result.flat();
  };

  const normalizer = (value) => {
    const min = -60;
    const max = 120;

    // Normalizar el valor
    const normalizerValue = (value - min) / (max - min);

    return normalizerValue;
  };

  const getPoints = async () => {
    try {
      setCurrentLoading(true);
      const csv_data = csv;
      const dates = calculateDates().map((date) => [
        date.getFullYear(),
        date.getMonth() + 1,
      ]);
      const results = {};
      const errors = new Set();
      const layerOrder = layers
        .slice(0, layers.length - 1)
        .map((layer) => layer.value);
      await Promise.all(
        csv_data.map(async (row) => {
          await Promise.all(
            dates.map(async (date, index) => {
              const season = `season_${index + 1}`;
              if (!results[row.point]) {
                results[row.point] = {};
              }
              if (!results[row.point][season]) {
                results[row.point][season] = {};
              }
              await Promise.all(
                layerOrder.map(async (layer) => {
                  const lon_plus = parseFloat(row.lon) + 0.2;
                  const lat_plus = parseFloat(row.lat) + 0.2;
                  const point_url = `${Configuration.get_geoserver_url()}${forecastSelected}/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=${forecastSelected}:${layer}&query_layers=${forecastSelected}:${layer}&feature_count=10&info_format=application/json&format_options=callback:handleJson&SrsName=EPSG:4326&width=101&height=101&x=50&y=50&time=${
                    date[0]
                  }-${date[1]}&bbox=${row.lon},${
                    row.lat
                  },${lon_plus},${lat_plus}`;
                  const response = await fetch(point_url);
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  const data = await response.json();
                  // Manejar la respuesta JSON

                  if (data.features.length > 0) {
                    const grayIndex = data.features[0].properties.GRAY_INDEX;
                    let value = Math.round(grayIndex);
                    if (
                      forecastSelected == Configuration.get_cenaos_worspace()
                    ) {
                      value = Math.round(normalizer(value) * 100);
                    }
                    results[row.point][season][layer] = value;
                  } else {
                    errors.add(row.point);
                    delete results[row.point][season];
                  }
                })
              );
            })
          );
        })
      );
      if (errors.size > 0) {
        notify(
          `Las siguientes localidades ingresadas no se encuentran en la región: ${[
            ...errors,
          ].join(", ")}`,
          "error"
        );
      }
      if (
        Object.keys(results).length > 0 &&
        Object.keys(results).some(
          (propertie) => Object.keys(results[propertie]).length > 0
        )
      ) {
        setData(results);
      }
      setCurrentLoading(false);
    } catch (error) {
      setCurrentLoading(false);
      notify(`Error al obtener los puntos`, "error");
    }
  };

  const handleFileChange = async (event) => {
    try {
      setCurrentLoading(true);
      const parsedData = await new Promise((resolve, reject) => {
        const file = event.target.files[0]; // Obtener el primer archivo seleccionado
        const reader = new FileReader(); // Crear un objeto FileReader

        reader.onload = function (e) {
          const content = e.target.result;
          const rows = content.split("\n");

          // Eliminar la primera línea ya que es el encabezado
          rows.shift();

          const data = rows.reduce((acc, row) => {
            const columns = row.split(",").map((col) => col.trim());
            if (columns.length === 3) {
              acc.push({
                point: columns[0],
                lat: columns[1],
                lon: columns[2],
              });
            }
            return acc;
          }, []);

          resolve(data);
        };

        reader.readAsText(file);
      });
      setCsv(parsedData);
      setCurrentLoading(false);
    } catch (error) {
      setCurrentLoading(false);
      notify(`Error al leer el archivo`, "error");
    }
  };

  const handleSelectChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

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

  const calculateDates = () => {
    // Get the current date
    let currentDate = new Date();
    currentDate.setDate(1);

    // Array to store the additional dates
    let additionalDates = [];

    // Calculate additional dates based on the forecast type
    if (typeForecast === "bi") {
      // Calculate the current date
      additionalDates.push(currentDate);

      // Calculate the date with two months added
      let dateTwoMonthsLater = new Date(currentDate);
      dateTwoMonthsLater.setMonth(currentDate.getMonth() + 2);
      additionalDates.push(dateTwoMonthsLater);

      // Calculate the date with four months added
      let dateFourMonthsLater = new Date(currentDate);
      dateFourMonthsLater.setMonth(currentDate.getMonth() + 4);
      additionalDates.push(dateFourMonthsLater);
    } else if (typeForecast === "tri") {
      // Calculate the date with one month added
      let dateOneMonthLater = new Date(currentDate);
      dateOneMonthLater.setMonth(currentDate.getMonth() + 1);
      additionalDates.push(dateOneMonthLater);

      // Calculate the date with four months added
      let dateFourMonthsLater = new Date(currentDate);
      dateFourMonthsLater.setMonth(currentDate.getMonth() + 4);
      additionalDates.push(dateFourMonthsLater);
    }

    return additionalDates;
  };

  const getAverage = async () => {
    const url = `${Configuration.get_api_url()}global_average`;
    const dates = calculateDates();
    try {
      const layers = await Promise.all(
        dates.map(async (date) => {
          const promises = average.map(async (element) => {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                workspace: forecastSelected,
                mosaic_name: element,
                month: date.getMonth() + 1,
                years: date.getFullYear(),
                user: user.user.user,
                passw: user.user.password,
              }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let value = Math.round(data.body);
            if (forecastSelected == Configuration.get_cenaos_worspace()) {
              value = Math.round(normalizer(value) * 100);
            }
            return { layer: element, value: value };
          });

          return await Promise.all(promises);
        })
      );
      setAverageData(layers);
    } catch (error) {
      notify(`Error al generar los promedios`, "error");
    }
  };

  const calcSeason = () => {
    const dates = calculateDates();
    let seasonCalc = [];
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const monthsC = [];
    if (typeForecast === "tri") {
      seasonCalc = dates.map((date) => {
        const month = date.getMonth();
        const previousMonth = month === 0 ? 11 : month - 1;
        const nextMonth = month === 11 ? 0 : month + 1;
        const season = `${monthNames[previousMonth]}-${monthNames[month]}-${monthNames[nextMonth]}`;

        monthsC.push(monthNames[previousMonth]);
        monthsC.push(monthNames[month]);
        monthsC.push(monthNames[nextMonth]);

        return season;
      });
    } else if (typeForecast === "bi") {
      seasonCalc = dates.map((date) => {
        const month = date.getMonth();
        const season = `${monthNames[month]}-${monthNames[(month + 1) % 12]}`;

        monthsC.push(monthNames[month]);
        monthsC.push(monthNames[(month + 1) % 12]);

        return season;
      });
    }
    const calcTitles = [titles[0]];
    seasonCalc.forEach((title) => calcTitles.push(`Temporada ${title}`));
    setTitles(calcTitles);
    setMonthsTitles(monthsC);
    setSeasons(seasonCalc);
  };

  const getRegionData = async () => {
    const url = `${Configuration.get_api_url()}data_region`;
    const dates = calculateDates().map((date) => [
      date.getFullYear(),
      date.getMonth() + 1,
    ]);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspace: forecastSelected,
          stores: average,
          shp_workspace:
            "administrative" /*Configuration.get_cenaos_worspace()*/,
          shp_store: "et_adm1" /*"Limite_Departamental_de_Honduras"*/,
          dates: dates,
          user: user.user.user,
          passw: user.user.password,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const body = await JSON.parse(data.body);
      delete body["Addis Ababa"];
      setData(body);
      setCurrentLoading(false);
      notify("El reporte se genero con exíto", "success");
    } catch (error) {
      notify(`No se encontro pronóstico para esta temporada`, "error");
      setCurrentLoading(false);
    }
  };

  const calcNewDates = (dates) => {
    function addMonths(year, month, num) {
      let newMonth = month + num;
      let newYear = year;
      while (newMonth > 12) {
        newMonth -= 12;
        newYear += 1;
      }
      while (newMonth < 1) {
        newMonth += 12;
        newYear -= 1;
      }
      return [newYear, newMonth];
    }
    let result = [];

    dates.forEach(([year, month]) => {
      if (typeForecast === "tri") {
        result.push(addMonths(year, month, -1));
        result.push([year, month]);
        result.push(addMonths(year, month, 1));
      } else if (typeForecast === "bi") {
        result.push([year, month]);
        result.push(addMonths(year, month, 1));
      }
    });

    return result;
  };

  const getHistorical = async () => {
    try {
      const csv_data = csv;
      const dates = calculateDates().map((date) => [
        date.getFullYear(),
        date.getMonth() + 1,
      ]);
      const newDates = calcNewDates(dates);
      const results = [];

      await Promise.all(
        csv_data.map(async (row) => {
          await Promise.all(
            newDates.map(async (date, index) => {
              if (!results[row.point]) {
                results[row.point] = [];
              }
              const lon_plus = parseFloat(row.lon) + 0.2;
              const lat_plus = parseFloat(row.lat) + 0.2;
              const point_url = `${Configuration.get_geoserver_url()}${Configuration.get_climatology_worspace()}/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=${Configuration.get_climatology_worspace()}:${Configuration.get_prec_store()}&query_layers=${Configuration.get_climatology_worspace()}:${Configuration.get_prec_store()}&feature_count=10&info_format=application/json&format_options=callback:handleJson&SrsName=EPSG:4326&width=101&height=101&x=50&y=50&time=${2000}-${
                date[1]
              }&bbox=${row.lon},${row.lat},${lon_plus},${lat_plus}`;
              const response = await fetch(point_url);
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              const data = await response.json();
              if (data.features.length > 0) {
                const grayIndex = data.features[0].properties.GRAY_INDEX;
                const value = Math.round(grayIndex);
                results[row.point].push(value);
              }
            })
          );
        })
      );
      setSecondData(results);
    } catch (error) {
      console.log(error);
      notify(`Error al obtener los historicos`, "error");
    }
  };

  const generateData = async () => {
    if (typeForecast == "" || forecastSelected == "" || csv == null) {
      notify(
        `Debe seleccionar el pronóstico y cargar las localidades`,
        "error"
      );
      return;
    }
    setCurrentLoading(true);
    calcSeason();
    await getAverage();
    await getHistorical();
    await getPoints();
    setCurrentLoading(false);
  };

  useEffect(() => {
    const newDate = new Date();
    if (typeForecast == "tri") {
      if (newDate.getMonth() + 2 == 13) {
        setMonthM(1);
        setYearM(newDate.getFullYear() + 1);
      } else {
        setMonthM(newDate.getMonth() + 2);
        setYearM(newDate.getFullYear());
      }
    } else {
      setMonthM(newDate.getMonth());
      setYearM(newDate.getFullYear());
    }
  }, [typeForecast]);

  return (
    <main className={styles.main}>
      {loading || !auth ? (
        <Loading />
      ) : (
        <>
          <Box ref={targetRef} className={styles.container}>
            <Box className={styles.config_container}>
              <Box className={styles.radio_container}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  className={styles.report_title}
                  style={{ margin: 0, display: "flex", alignItems: "center" }}
                >
                  Tipo de pronóstico:
                </Typography>
                <FormControl>
                  <RadioGroup
                    row
                    name="row-radio-buttons-group"
                    value={typeForecast}
                    onChange={handleSelectChange(setTypeForecast)}
                  >
                    <FormControlLabel
                      value={"bi"}
                      control={<Radio />}
                      label="Bimestral"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={"tri"}
                      control={<Radio />}
                      label="Trimestral"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box className={styles.selectors_container}>
                <Box>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    className={styles.report_title}
                    style={{ margin: 0, display: "flex", alignItems: "center" }}
                  >
                    Seleccione el pronóstico para generar el reporte:
                  </Typography>
                  <FormControl
                    className={styles.info_inputs}
                    sx={{ m: 1, minWidth: 120, width: "80%" }}
                    size="small"
                  >
                    <InputLabel
                      id="select_forecast1_hc"
                      style={{ color: "#7b8b9d" }}
                    >
                      {"Seleccione el pronóstico"}
                    </InputLabel>
                    <Select
                      labelId="select_forecast1_hc"
                      input={
                        <OutlinedInput
                          style={{ backgroundColor: "#e6eaed" }}
                          label={"Seleccione el pronóstico"}
                          value={forecastSelected}
                          onChange={handleSelectChange(setForecastSelected)}
                        />
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {workspaces.map((d) => (
                        <MenuItem key={d.value} value={d.value}>
                          {d.display}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box className={styles.buttons_container}>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    className={styles.report_title}
                    style={{ margin: 0, display: "flex", alignItems: "center" }}
                  >
                    Seleccionar archivo CSV de Localidades:
                  </Typography>
                  <Box className={styles.file_container}>
                    <input
                      type="file"
                      id="file-input"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept=".csv"
                    />
                    <label htmlFor="file-input">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<UploadFileIcon />}
                        style={{
                          width: "100%",
                          backgroundColor: "#e37b13",
                          color: "#ffff",
                          height: "42px",
                          borderRadius: "6px",
                        }}
                      >
                        Cargar CSV
                      </Button>
                    </label>
                    {selectedFile && (
                      <Typography variant="body2">
                        Archivo seleccionado: {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    {selectedFile && (
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={cleanFilter}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                component="span"
                style={{
                  width: "18%",
                  backgroundColor: "#e37b13",
                  color: "#ffff",
                  height: "42px",
                  borderRadius: "6px",
                }}
                onClick={generateData}
              >
                Generar pronóstico
              </Button>
            </Box>

            <Typography
              variant="h4"
              color="textSecondary"
              className={styles.report_title}
            >
              Reporte
            </Typography>
            <Box className={styles.graph_container}>
              <Box>
                <Typography
                  variant="h5"
                  color="textSecondary"
                  className={styles.report_title}
                >
                  Pronóstico estacional
                </Typography>
                <Typography variant="body2" className={styles.card_text}>
                  {``}
                </Typography>
              </Box>
              <Box className={styles.chart_container}>
                {averageData &&
                averageData.length > 0 &&
                averageData[0].length > 0 ? (
                  averageData.map((chart, index) => {
                    const values = chart.map((val) => val.value);
                    return (
                      <Box key={index} className={styles.chart_info}>
                        <Typography
                          key={`${index}_title`}
                          variant="h6"
                          color="textSecondary"
                          className={styles.report_title}
                        >{`Temporada ${seasons[index]}`}</Typography>
                        <ChartReport
                          key={`${index}_chart`}
                          data={values}
                          type="bar"
                          width="500"
                          colors={["#97cdd8", "#b3e4b3", "#e3bab2"]}
                          titles={[
                            "Encima de lo normal",
                            "Normal",
                            "Debajo de lo normal",
                          ]}
                        />
                      </Box>
                    );
                  })
                ) : (
                  <>
                    <Box className={styles.chart_info}>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        className={styles.report_title}
                      >
                        Temporada 1
                      </Typography>
                      <ChartReport
                        data={[0, 0, 0, 0]}
                        type="bar"
                        width="500"
                        colors={["#97cdd8", "#b3e4b3", "#e3bab2"]}
                        titles={[
                          "Encima de lo normal",
                          "Normal",
                          "Debajo de lo normal",
                        ]}
                      />
                    </Box>
                    <Box className={styles.chart_info}>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        className={styles.report_title}
                      >
                        Temporada 2
                      </Typography>
                      <ChartReport
                        data={[0, 0, 0, 0]}
                        type="bar"
                        width="500"
                        colors={["#97cdd8", "#b3e4b3", "#e3bab2"]}
                        titles={[
                          "Encima de lo normal",
                          "Normal",
                          "Debajo de lo normal",
                        ]}
                      />
                    </Box>
                  </>
                )}
              </Box>
              {seasons &&
                seasons.length > 0 &&
                seasons.map((season) => (
                  <Box key={`${season}_box`} className={styles.maps_container}>
                    <Typography
                      key={`${season}_title`}
                      variant="h6"
                      color="textSecondary"
                      style={{ alignSelf: "center" }}
                      className={styles.report_title}
                    >{`Temporada ${season}`}</Typography>
                    {[0, 1].map((index) => (
                      <Box key={index} className={styles.first_maps_container}>
                        {[0, 1].map((subIndex) => (
                          <Card key={subIndex} className={styles.map_container}>
                            <CardHeader
                              className={styles.map_card_header}
                              title={`${layers[index * 2 + subIndex].display}`}
                            />
                            <CardContent
                              className={styles.map_card_content}
                              style={{ padding: 0 }}
                            >
                              <Map
                                key={`${subIndex}_map`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  justifySelf: "center",
                                }}
                                zoom={7}
                                center={[14.5007343, -86.6719949]}
                                url={Configuration.get_geoserver_url()}
                                workspace={forecastSelected}
                                store={layers[index * 2 + subIndex].value}
                                year={yearM}
                                month={monthM}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              <Box className={styles.line_chart_container}>
                {data &&
                  secondData &&
                  Object.keys(data).map((p, index) => (
                    <Box
                      className={styles.temporal_container}
                      key={`box_${index}`}
                    >
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        className={styles.report_title}
                        key={`title_${index}`}
                      >
                        {`Datos localidad: ${p}`}
                      </Typography>
                      <Box className={styles.charts_loca}>
                        <ChartReport
                          key={`chart_clima_${index}`}
                          data={secondData[p]}
                          type="clima"
                          width="600"
                          colors={["#97cdd8", "#b3e4b3", "#e3bab2"]}
                          titles={monthsTitles}
                        />
                        <ChartReport
                          key={`chart_proba_${index}`}
                          data={Object.values(data[p]).reduce((acc, season) => {
                            return acc.concat(Object.values(season));
                          }, [])}
                          type="proba"
                          width="600"
                          colors={["#97cdd8", "#b3e4b3", "#e3bab2"]}
                          titles={generateTitles(data[p])}
                          monthTitles={seasons}
                        />
                      </Box>
                    </Box>
                  ))}
              </Box>

              <Box className={styles.csv_table_container}>
                <Box className={styles.csv_table_info}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    className={styles.report_title}
                  >
                    Datos por localidad
                  </Typography>
                  <Typography variant="body2" className={styles.card_text}>
                    {``}
                  </Typography>
                </Box>
                <Box>
                  <CsvTable titles={titles} data={data} subTitles={subTitles} />
                </Box>
              </Box>
            </Box>
          </Box>
          <Button
            startIcon={<PictureAsPdfIcon />}
            onClick={() => toPDF()}
            style={{
              width: "20%",
              backgroundColor: "#e37b13",
              color: "#ffff",
              height: "42px",
              borderRadius: "6px",
              alignSelf: "flex-end",
              marginTop: "2%",
            }}
          >
            Descargar PDF
          </Button>
        </>
      )}
      {currentLoading && <LoadingOverlay />}
    </main>
  );
};

export default Report;
