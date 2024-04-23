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

  const [selectFirstForecast, setSelectFirstForecast] = useState("");
  const [selectSecondForecast, setSelectSecondForecast] = useState("");
  const [selectHc, setSelectHc] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [lastMonth, setLastMonth] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("");

  const [typeForecast, setTypeForecast] = useState("tri");

  const [layers, setLayers] = useState([
    { display: "Above", value: Configuration.get_above_store() },
    { display: "Normal", value: Configuration.get_normal_store() },
    { display: "Below", value: Configuration.get_below_store() },
    { display: "Highest probability", value: Configuration.get_hgp_store() },
  ]);

  const [years, setYears] = useState([]);

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

  useEffect(() => {
    getDatesFromGeoserver(
      Configuration.get_historical_worspace(),
      Configuration.get_prec_store()
    ).then((dates) => {
      const uniqueYears = [...new Set(dates.map((date) => date.split("-")[0]))];
      setYears(uniqueYears);
      setLastMonth(parseInt(dates[dates.length - 1].split("-")[1]));
    });
  }, []);

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

  return (
    <Container maxWidth="xl" className={styles.container}>
      {loading || !auth ? (
        <Loading />
      ) : (
        <>
          <Box height={"13%"} marginBottom={"4%"}>
            <h1>Visualizador</h1>
            <p>
              {`Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only
        five centuries`}
            </p>
            <Box className={styles.first_part_inputs}>
              <FormControl>
                <FormLabel id="row-radio-buttons-group-label">
                  Tipo de pronostico:
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="row-radio-buttons-group-label"
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
                sx={{ m: 1, minWidth: 120, width: "20%", alignSelf: "end" }}
                size="small"
              >
                <InputLabel id="select_layer_hc">{"Capa"}</InputLabel>
                <Select
                  labelId="select_layer_hc"
                  input={
                    <OutlinedInput
                      label={"Capa"}
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
          </Box>
          <Grid
            container
            spacing={2}
            height={"80%"}
            className={styles.grid_container}
          >
            <Grid className={styles.column_container} xs={6}>
              <Box className={styles.container_info}>
                <Box className={styles.info_title}>
                  <h2>Pronóstico 1</h2>
                  <p>
                    {`Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy
              text ever`}
                  </p>
                </Box>

                <FormControl
                  className={styles.info_inputs}
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="select_forecast1_hc">
                    {"Pronóstico"}
                  </InputLabel>
                  <Select
                    labelId="select_forecast1_hc"
                    input={
                      <OutlinedInput
                        label={"Pronóstico"}
                        value={selectFirstForecast}
                        onChange={handleSelectChange(setSelectFirstForecast)}
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
                />
              </Box>
            </Grid>
            <Grid className={styles.grid_card} xs={6}>
              <Box className={styles.container_info}>
                <Box className={styles.info_title}>
                  <h2>Pronóstico 2</h2>
                  <p>
                    {`Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy
              text ever type specimen book. It has survived not only five
              centuries`}
                  </p>
                </Box>
                <FormControl
                  className={styles.info_inputs}
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                >
                  <InputLabel id="select_forecast2_hc">
                    {"Pronóstico"}
                  </InputLabel>
                  <Select
                    labelId="select_forecast2_hc"
                    input={
                      <OutlinedInput
                        label={"Pronóstico"}
                        value={selectSecondForecast}
                        onChange={handleSelectChange(setSelectSecondForecast)}
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
                />
              </Box>
            </Grid>
            {/* <Grid className={styles.grid_card} xs={6}>
              <Box className={styles.container_info}>
                <Box className={styles.info_title}>
                  <h2>Historico climatico</h2>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and type
                    scrambled it to make a type specimen book. It has survived
                    not only five centuries
                  </p>
                </Box>
                <Box className={styles.multiple_inputs}>
                  <FormControl
                    className={styles.info_inputs}
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="select_year_hc">{"Año"}</InputLabel>
                    <Select
                      labelId="select_year_hc"
                      input={
                        <OutlinedInput
                          label={"Año"}
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
                    className={styles.info_inputs}
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="select_month_hc">{"Mes"}</InputLabel>
                    <Select
                      labelId="select_month_hc"
                      input={
                        <OutlinedInput
                          label={"Mes"}
                          value={selectHc}
                          onChange={handleSelectChange(setSelectHc)}
                        />
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {months.map((d, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box className={styles.container_map}>
                <Map
                  className={""}
                  zoom={7}
                  center={[14.5007343, -86.6719949]}
                  url={Configuration.get_geoserver_url()}
                  workspace={Configuration.get_historical_worspace()}
                  store={Configuration.get_prec_store()}
                  year={selectYear}
                  month={selectHc}
                />
              </Box>
            </Grid> */}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Visualizer;
