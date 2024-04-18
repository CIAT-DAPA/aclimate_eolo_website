"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Configuration from "@/app/config";
import Map from "@/app/Components/Map";
import MultiSelect from "@/app/Components/MultiSelect";
import axios from "axios";

export default function Home() {
  const [selectedYearHc, setSelectedYearHc] = useState("");
  const [selectedMonthC, setSelectedMonthC] = useState("");
  const [anomalies, setAnomalies] = useState(null);

  const [multiSelectData, setMultiSelectData] = useState([]);

  const [years, setYears] = useState([]);
  const [multYears, setMultYears] = useState([]);
  const [lastMonth, setLastMonth] = useState(null);
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
    setAnomalies({url: Configuration.get_api_url(), month:selectedMonthC, years:multiSelectData})
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

  useEffect(() => {
    getDatesFromGeoserver(
      Configuration.get_historical_worspace(),
      Configuration.get_prec_store()
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

    if (selectedYearHc == years[years.length - 1]) {
      const filteredMonths = months.slice(0, lastMonth);
      setMonths(filteredMonths);
    } else {
      if (months.length != monthsC.length) {
        setMonths([...monthsC]);
      }
    }
  }, [selectedYearHc]);

  return (
    <main className={styles.main}>
      <div className={styles.title_analogues_container}>
        <h1>Analogos</h1>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries
        </p>
        <FormControl sx={{ m: 1, minWidth: 60, width: "30%" }} size="small">
          <InputLabel id="select_month">{"Mes"}</InputLabel>
          <Select
            labelId="select_month"
            input={
              <OutlinedInput
                label={"Mes"}
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
      </div>

      <div className={styles.map_container}>
        <div className={styles.historical_map}>
          <div className={styles.info_container}>
            <h2>Historicos Climaticos</h2>
            <p>
              Vestibulum varius maximus odio, vitae porttitor metus lobortis in.
              Sed ut hendrerit tortor, non lobortis ex. Suspendisse sagittis
              sollicitudin lorem, quis ornare eros tempor congue
            </p>
            <FormControl sx={{ m: 1, minWidth: 60, width: "30%" }} size="small">
              <InputLabel id="select_year_hc">{"Año"}</InputLabel>
              <Select
                labelId="select_year_hc"
                input={
                  <OutlinedInput
                    label={"Año"}
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

          <Map
            className={styles.map}
            zoom={7}
            center={[14.5007343, -86.6719949]}
            url={Configuration.get_geoserver_url()}
            workspace={Configuration.get_historical_worspace()}
            store={Configuration.get_prec_store()}
            year={selectedYearHc}
            month={selectedMonthC}
          />
        </div>

        <div className={styles.historical_map}>
          <div className={styles.info_container}>
            <h2>Promedio de historicos climaticos</h2>
            <p>
              Vestibulum varius maximus odio, vitae porttitor metus lobortis in.
              Sed ut hendrerit tortor, non lobortis ex. Suspendisse sagittis
              sollicitudin lorem, quis ornare eros tempor congue
            </p>
          </div>

          <Map
            className={styles.map}
            zoom={7}
            center={[14.5007343, -86.6719949]}
            url={Configuration.get_geoserver_url()}
            workspace={Configuration.get_climatology_worspace()}
            store={Configuration.get_prec_store()}
            year={2000}
            month={selectedMonthC}
          />
        </div>

        <div className={styles.anomalies_map}>
          <div className={styles.info_container}>
            <h2>Anomalias</h2>
            <p>
              Vestibulum varius maximus odio, vitae porttitor metus lobortis in.
              Sed ut hendrerit tortor, non lobortis ex. Suspendisse sagittis
              sollicitudin lorem, quis ornare eros tempor congue
            </p>

            <div className={styles.anomalies_but_cont}>
              <MultiSelect
                arrayData={multYears}
                label={"Años analogos"}
                data={multiSelectData}
                setData={setMultiSelectData}
              />
              <IconButton
                aria-label="Calcular anomalia"
                color="primary"
                onClick={createAnomaly}
              >
                <SendIcon />
              </IconButton>
            </div>
          </div>
          <Map
            className={styles.map}
            zoom={7}
            center={[14.5007343, -86.6719949]}
            anomalies={anomalies}
            isAnomalies={true}
          />
        </div>
      </div>
      <div>
        <Button>Cargar datos</Button>
      </div>
    </main>
  );
}
