"use client";
import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import { FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Configuration from "@/app/config";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import styles from "./visualizer.module.css";
import dynamic from "next/dynamic";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const Map = dynamic(() => import("@/app/Components/Map"), { ssr: false });

const Visualizer = () => {
  const { loading, auth } = useAuth();

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
  const [seasonMonth, setSeasonMonth] = useState("")
  const [seasonYear, setSeasonYear] = useState("")

  // Arrays of years
  const [years, setYears] = useState([]);

  // Arrays of months cut
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

  const calcSeason = () =>{
    const dates = calculateDates()
  }

  useEffect(() => {
    if (selectFirstForecast != "" && selectedLayer != "") {
      getDatesFromGeoserver(selectFirstForecast, selectedLayer).then(
        (dates) => {
          const uniqueYears = [
            ...new Set(dates.map((date) => date.split("-")[0])),
          ];
          setYears(uniqueYears);
          setLastMonth(parseInt(dates[dates.length - 1].split("-")[1]));
        }
      );
    }

    if (selectSecondForecast != "" && selectedLayer != "") {
      getDatesFromGeoserver(selectSecondForecast, selectedLayer).then(
        (dates) => {
          const uniqueYears = [
            ...new Set(dates.map((date) => date.split("-")[0])),
          ];
          setYears(uniqueYears);
          const lastM = parseInt(dates[dates.length - 1].split("-")[1]);
          if (lastMonth < lastM) {
            setLastMonth(lastM);
          }
        }
      );
    }
  }, [selectFirstForecast, selectedLayer, selectSecondForecast]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectYear == years[years.length - 1]) {
      const filteredMonths = months.slice(0, lastMonth);
      setMonths(filteredMonths);
    } else {
      if (months.length != monthsC.length) {
        setMonths([...monthsC]);
      }
    }
  }, [selectYear]);

  useEffect(() => {
    if (typeForecast !== "" && selectMonth !== "" && selectYear!== "" ) {
      const dates = calcSeason();
      console.log(dates)
    }
  }, [typeForecast, selectMonth, selectYear]);

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
            <Grid className={styles.column_container} xs={6}>
              <Box className={styles.container_map}>
                <Map
                  className={""}
                  zoom={7}
                  center={[14.5007343, -86.6719949]}
                  url={Configuration.get_geoserver_url()}
                  workspace={selectFirstForecast}
                  store={selectedLayer}
                  year={2024}
                  month={5}
                  
                  style={{
                    width: "100%",
                    height: "100%",
                    justifySelf: "center",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  child={
                    <Box className={styles.container_info}>
                      <Box className={styles.info_title}>
                        <h2>Pronóstico 1</h2>
                      </Box>

                      <FormControl
                        className={styles.info_inputs}
                        sx={{ m: 1, minWidth: 120 }}
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
                              label={"Pronóstico"}
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
                  childComponent={
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
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 120,
                          width: "70%",
                        }}
                        size="small"
                      >
                        <InputLabel
                          id="select_layer_hc"
                          style={{ color: "#7b8b9d", fontWeight: "bold" }}
                        >
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
                  year={2024}
                  month={8}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifySelf: "center",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  child={
                    <Box className={styles.first_part_inputs}>
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 120,
                          width: "70%",
                        }}
                        size="small"
                      >
                        <InputLabel
                          id="select_layer_hc"
                          style={{ color: "#7b8b9d", fontWeight: "bold" }}
                        >
                          {"Seleccione el año"}
                        </InputLabel>
                        <Select
                          labelId="select_layer_hc"
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
                        sx={{
                          m: 1,
                          minWidth: 120,
                          width: "70%",
                        }}
                        size="small"
                      >
                        <InputLabel
                          id="select_layer_hc"
                          style={{ color: "#7b8b9d", fontWeight: "bold" }}
                        >
                          {"Seleccione el mes"}
                        </InputLabel>
                        <Select
                          labelId="select_layer_hc"
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
                          {months.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  }
                  childComponent={
                    <Box
                      className={styles.container_info}
                      style={{ marginRight: "4%" }}
                    >
                      <Box className={styles.info_title}>
                        <h2>Pronóstico 2</h2>
                      </Box>

                      <FormControl
                        className={styles.info_inputs}
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                      >
                        <InputLabel
                          id="select_forecast2_hc"
                          style={{ color: "#7b8b9d", fontWeight: "bold" }}
                        >
                          {"Seleccione el pronóstico"}
                        </InputLabel>
                        <Select
                          labelId="select_forecast2_hc"
                          input={
                            <OutlinedInput
                              style={{ backgroundColor: "#e6eaed" }}
                              label={"Pronóstico"}
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
    </Container>
  );
};

export default Visualizer;
