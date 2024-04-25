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
} from "@mui/material";
import LoadingOverlay from "../Components/LoadingOverlay";
import AuthContext from "@/app/Context/auth/authContext";
import { toast } from "react-toastify";

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
  const [typeForecast, setTypeForecast] = useState("tri");
  const [currentLoading, setCurrentLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [csv, setCsv] = useState(null);
  const [titles, setTitles] = useState([
    "Región",
    "Temporada 1",
    "Temporada 2",
  ]);
  const [subTitles, setSubTitles] = useState([
    "Encima de lo normal",
    "Normal",
    "Debajo de lo normal",
    "Mayor probabilidad",
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
      display: "Análogos - CIAT",
      value: Configuration.get_analogues_worspace(),
      type: "tri",
    },
    {
      display: "Análogos - CENAOS",
      value: Configuration.get_cenaos_worspace(),
      type: "tri",
    },
  ]);

  const [averageData, setAverageData] = useState([]);

  const [average, setAverage] = useState([
    Configuration.get_above_store(),
    Configuration.get_normal_store(),
    Configuration.get_below_store(),
    Configuration.get_hgp_store(),
  ]);

  const cleanFilter = () => {
    setCsv(null);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    const file = event.target.files[0]; // Obtener el primer archivo seleccionado
    const reader = new FileReader(); // Crear un objeto FileReader

    reader.onload = function (e) {
      const content = e.target.result;
      const rows = content.split("\n");

      const splited = rows[0].split(",");

      const column = splited.map((elemento) => elemento.trim());
      setCsv(column.slice(1));
    };

    reader.readAsText(file);
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
            return { layer: element, value: Math.round(data.body) };
          });

          return await Promise.all(promises);
        })
      );

      setAverageData(layers);
    } catch (error) {
      console.log(error)
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
    if (typeForecast === "tri") {
      seasonCalc = dates.map((date) => {
        const month = date.getMonth();
        const previousMonth = month === 0 ? 11 : month - 1;
        const nextMonth = month === 11 ? 0 : month + 1;
        const season = `${monthNames[previousMonth]}-${monthNames[month]}-${monthNames[nextMonth]}`;
        return season;
      });
    } else if (typeForecast === "bi") {
      seasonCalc = dates.map((date) => {
        const month = date.getMonth();
        const season = `${monthNames[month]}-${monthNames[(month + 1) % 12]}`;
        return season;
      });
    }
    const calcTitles = [titles[0]];
    seasonCalc.forEach((title) => calcTitles.push(`Temporada ${title}`));
    setTitles(calcTitles);
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
      setData(body);
      setCurrentLoading(false);
      notify("El reporte se genero con exíto", "success");
    } catch (error) {
      notify(`No se encontro pronóstico para esta temporada`, "error");
      setCurrentLoading(false);
    }
  };

  useEffect(() => {
    if (typeForecast !== "" && forecastSelected !== "") {
      setCurrentLoading(true);
      calcSeason();
      getAverage();
      getRegionData();
    }
  }, [typeForecast, forecastSelected]);

  return (
    <main className={styles.main}>
      {loading || !auth ? (
        <Loading />
      ) : (
        <>
          <Box ref={targetRef} className={styles.container}>
            <Box className={styles.selectors_container}>
              <FormControl
                className={styles.info_inputs}
                sx={{ m: 1, minWidth: 120, width: "20%" }}
                size="small"
              >
                <InputLabel
                  id="select_forecast1_hc"
                  style={{ color: "#7b8b9d", fontWeight: "bold" }}
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
                <Typography
                  variant="body2"
                  className={styles.card_text}
                >
                  {`Vestibulum varius maximus odio, vitae porttitor metus lobortis
                  in. Sed ut hendrerit tortor, non lobortis ex. Suspendisse
                  sagittis sollicitudin lorem, quis ornare eros tempor congue`}
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
                      <ChartReport data={[0, 0, 0, 0]} type="bar" width="500" />
                    </Box>
                    <Box className={styles.chart_info}>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        className={styles.report_title}
                      >
                        Temporada 2
                      </Typography>
                      <ChartReport data={[0, 0, 0, 0]} type="bar" width="500" />
                    </Box>
                  </>
                )}
              </Box>
              <Box className={styles.csv_table_container}>
                <Box className={styles.csv_table_info}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    className={styles.report_title}
                  >
                    Datos por región
                  </Typography>
                  <Typography
                    variant="body2"
                    className={styles.card_text}
                  >
                    {`Vestibulum varius maximus odio, vitae porttitor metus lobortis
                  in. Sed ut hendrerit tortor, non lobortis ex. Suspendisse
                  sagittis sollicitudin lorem, quis ornare eros tempor congue`}
                  </Typography>
                  <Box className={styles.buttons_container}>
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
                <Box>
                  <CsvTable
                    titles={titles}
                    data={data}
                    subTitles={subTitles}
                    filter={csv}
                  />
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
