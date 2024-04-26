"use client";
import { useState, useEffect } from "react";
import {
  FormControlLabel,
  RadioGroup,
  OutlinedInput,
  MenuItem,
  FormControl,
  Radio,
  Box,
  Container,
  Select,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Configuration from "@/app/config";
import axios from "axios";
import styles from "./visualizer.module.css";
import dynamic from "next/dynamic";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import LoadingOverlay from "../Components/LoadingOverlay";

const Map = dynamic(() => import("@/app/Components/Map"), { ssr: false });

const Visualizer = () => {
  const { loading, auth } = useAuth();
  const [currentLoading, setCurrentLoading] = useState(false);

  // Selected forecast data
  const [selectFirstForecast, setSelectFirstForecast] = useState("");
  const [selectSecondForecast, setSelectSecondForecast] = useState("");

  //Selected year and month
  const [selectMonth, setSelectMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");

  // To calc the last month available in geo
  const [lastMonth, setLastMonth] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("");

  // Calc year and month using forecast type
  const [seasonMonth, setSeasonMonth] = useState("");
  const [seasonYear, setSeasonYear] = useState("");

  const [uniqueMonth, setUniqueMonth] = useState({});

  // Arrays of years
  const [years, setYears] = useState([]);

  // Arrays of months cut
  const [months, setMonths] = useState([]);
  // Arrays of months
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

  // Selected type of forecast
  const [typeForecast, setTypeForecast] = useState("tri");

  // Layers
  const [layers, setLayers] = useState([
    { display: "Above", value: Configuration.get_above_store() },
    { display: "Normal", value: Configuration.get_normal_store() },
    { display: "Below", value: Configuration.get_below_store() },
    { display: "Highest probability", value: Configuration.get_hgp_store() },
  ]);

  // Workspaces
  const [workspaces, setWorkspaces] = useState([
    { display: "NextGen", value: Configuration.get_nextgen_worspace() },
    { display: "AClimate", value: Configuration.get_aclimate_worspace() },
    {
      display: "Análogos - CIAT",
      value: Configuration.get_analogues_worspace(),
    },
    {
      display: "Análogos - CENAOS",
      value: Configuration.get_cenaos_worspace(),
    },
  ]);

  const calculateDates = () => {
    // Get the current date
    let currentDate = new Date(selectYear, selectMonth);
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

  const handleChange = (event) => {
    setTypeForecast(event.target.value);
  };

  const handleSelectChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  function handleDates(date) {
    const [year, month] = date.split("-");
    if (typeForecast === "tri") {
      const adjustedMonth =
        month === "01"
          ? "12"
          : (parseInt(month) - 1).toString().padStart(2, "0");
      const adjustedYear =
        month === "01" ? (parseInt(year) - 1).toString() : year;
      return `${adjustedYear}-${adjustedMonth}`;
    } else {
      return date;
    }
  }

  const getDates = async () => {
    let dataObject1, dataObject2;
    setCurrentLoading(true);
    if (selectFirstForecast != "" && selectedLayer != "") {
      const dates = await getDatesFromGeoserver(
        selectFirstForecast,
        selectedLayer
      );
      // const uniqueYears = [
      //   ...new Set(dates.map((date) => date.split("-")[0])),
      // ];
      // setYears(uniqueYears);
      // setLastMonth(parseInt(dates[dates.length - 1].split("-")[1]));
      dataObject1 = dates.reduce((object, date) => {
        const [year, month] = handleDates(date, typeForecast).split("-");
        if (!object[year]) {
          object[year] = [parseInt(month)];
        } else {
          if (!object[year].includes(parseInt(month))) {
            object[year].push(parseInt(month));
          }
        }
        return object;
      }, {});
    }

    if (selectSecondForecast != "" && selectedLayer != "") {
      const dates = await getDatesFromGeoserver(
        selectSecondForecast,
        selectedLayer
      );
      // const uniqueYears = [
      //   ...new Set(dates.map((date) => date.split("-")[0])),
      // ];
      // setYears(uniqueYears);
      // const lastM = parseInt(dates[dates.length - 1].split("-")[1]);
      // if (lastMonth < lastM) {
      //   setLastMonth(lastM);
      // }
      dataObject2 = dates.reduce((object, date) => {
        const [year, month] = handleDates(date, typeForecast).split("-");
        if (!object[year]) {
          object[year] = [parseInt(month)];
        } else {
          if (!object[year].includes(parseInt(month))) {
            object[year].push(parseInt(month));
          }
        }
        return object;
      }, {});
    }

    if (dataObject1 && dataObject2) {
      const result = {};

      // Get all years present in both objects
      const years = [
        ...new Set([...Object.keys(dataObject1), ...Object.keys(dataObject2)]),
      ];
      setYears(years);
      // Iterate over each year and keep only the months present in both arrays corresponding to that year
      years.forEach((year) => {
        const monthsArray1 = dataObject1[year] || [];
        const monthsArray2 = dataObject2[year] || [];
        const commonMonths = monthsArray1.filter((month) =>
          monthsArray2.includes(month)
        );
        if (commonMonths.length > 0) {
          result[year] = commonMonths;
        }
      });
      setUniqueMonth(result);
    }
    setCurrentLoading(false);
  };

  useEffect(() => {
    getDates();
  }, [selectFirstForecast, selectedLayer, selectSecondForecast]);

  useEffect(() => {
    if (selectYear) {
      const months = uniqueMonth[selectYear];
      const filterMonths = months.map((position) => monthsC[position - 1]);
      setMonths(filterMonths);
    }
  }, [selectYear]);

  useEffect(() => {
    if (typeForecast === "tri") {
      if (selectMonth == 12) {
        setSeasonMonth(1);
        setSeasonYear(selectYear + 1);
      } else {
        setSeasonMonth(selectMonth + 1);
        setSeasonYear(selectYear);
      }
    } else {
      setSeasonMonth(selectMonth);
      setSeasonYear(selectYear);
    }
  }, [selectMonth, typeForecast]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => {
  //   if (selectYear == years[years.length - 1]) {
  //     const filteredMonths = months.slice(0, lastMonth);
  //     setMonths(filteredMonths);
  //   } else {
  //     if (months.length != monthsC.length) {
  //       setMonths([...monthsC]);
  //     }
  //   }
  // }, [selectYear]);

  // useEffect(() => {
  //   if (typeForecast !== "" && selectMonth !== "" && selectYear!== "" ) {
  //     const dates = calcSeason();
  //     console.log(dates)
  //   }
  // }, [typeForecast, selectMonth, selectYear]);

  return (
    <Container maxWidth="xl" className={styles.container}>
      {loading || !auth ? (
        <Loading />
      ) : (
        <>
          <Grid
            container
            spacing={2}
            height={"80%"}
            className={styles.grid_container}
          >
            <Box className={styles.modal_container}>
              <Box className={styles.first_part_inputs}>
                <FormControl>
                  <RadioGroup
                    row
                    name="row-radio-buttons-group"
                    value={typeForecast}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value={"bi"}
                      control={<Radio size="small" />}
                      label="Bimestral"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={"tri"}
                      control={<Radio size="small" />}
                      label="Trimestral"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box className={styles.first_part_inputs}>
                <FormControl
                  className={styles.info_inputs_menu}
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="select_layer_hc" style={{ color: "#7b8b9d" }}>
                    {"Seleccione la capa"}
                  </InputLabel>
                  <Select
                    labelId="select_layer_hc"
                    input={
                      <OutlinedInput
                        style={{ backgroundColor: "#e6eaed" }}
                        label={"Seleccione la capa"}
                        value={selectedLayer}
                        onChange={handleSelectChange(setSelectedLayer)}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {layers.map((d) => (
                      <MenuItem key={d.value} value={d.value}>
                        {d.display}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div className={styles.vertical_line}></div>
                <FormControl
                  className={styles.info_inputs_menu}
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="select_year_hc" style={{ color: "#7b8b9d" }}>
                    {"Seleccione el año"}
                  </InputLabel>
                  <Select
                    labelId="select_year_hc"
                    disabled={years.length == 0}
                    input={
                      <OutlinedInput
                        style={{ backgroundColor: "#e6eaed" }}
                        label={"Seleccione el año"}
                        value={selectYear}
                        onChange={handleSelectChange(setSelectYear)}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {years.map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  className={styles.info_inputs_menu}
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="select_month_hc" style={{ color: "#7b8b9d" }}>
                    {"Seleccione el mes"}
                  </InputLabel>
                  <Select
                    labelId="select_month_hc"
                    disabled={months.length == 0}
                    input={
                      <OutlinedInput
                        style={{ backgroundColor: "#e6eaed" }}
                        label={"Seleccione el mes"}
                        value={selectMonth}
                        onChange={handleSelectChange(setSelectMonth)}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {months.map((d, i) => (
                      <MenuItem key={d} value={monthsC.indexOf(d) + 1}>
                        {d}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Grid className={styles.column_container} xs={6}>
              <Box className={styles.container_map}>
                <Map
                  className={""}
                  zoom={7}
                  center={[14.5007343, -86.6719949]}
                  url={Configuration.get_geoserver_url()}
                  workspace={selectFirstForecast}
                  store={selectedLayer}
                  year={seasonYear}
                  month={seasonMonth}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifySelf: "center",
                    display: "flex",
                  }}
                  child={
                    <Box
                      className={[
                        styles.container_info,
                        styles.first_forecast,
                      ].join(" ")}
                    >
                      <Box className={styles.info_title}>
                        <h3>Pronóstico 1</h3>
                      </Box>

                      <FormControl
                        className={styles.info_inputs}
                        sx={{ m: 1, minWidth: 120 }}
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
                              value={selectFirstForecast}
                              onChange={handleSelectChange(
                                setSelectFirstForecast
                              )}
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
                  }
                />
              </Box>
            </Grid>
            <Grid className={styles.column_container} xs={6}>
              <Box className={styles.container_map}>
                <Map
                  className={""}
                  zoom={7}
                  center={[14.5007343, -86.6719949]}
                  url={Configuration.get_geoserver_url()}
                  workspace={selectSecondForecast}
                  store={selectedLayer}
                  year={seasonYear}
                  month={seasonMonth}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifySelf: "center",
                    display: "flex",
                  }}
                  child={
                    <Box
                      className={[
                        styles.container_info,
                        styles.second_forecast,
                      ].join(" ")}
                    >
                      <Box className={styles.info_title}>
                        <h3>Pronóstico 2</h3>
                      </Box>

                      <FormControl
                        className={styles.info_inputs}
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                      >
                        <InputLabel
                          id="select_forecast2_hc"
                          style={{ color: "#7b8b9d" }}
                        >
                          {"Seleccione el pronóstico"}
                        </InputLabel>
                        <Select
                          labelId="select_forecast2_hc"
                          input={
                            <OutlinedInput
                              style={{ backgroundColor: "#e6eaed" }}
                              label={"Seleccione el pronóstico"}
                              value={selectSecondForecast}
                              onChange={handleSelectChange(
                                setSelectSecondForecast
                              )}
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
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      {currentLoading && <LoadingOverlay style={{ zIndex: 999999 }} />}
    </Container>
  );
};

export default Visualizer;
