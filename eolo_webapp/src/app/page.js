"use client"
import { useState } from "react";
import styles from "./page.module.css";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from '@mui/material/OutlinedInput';
import Configuration from "@/app/config"
import Map from "@/app/Components/Map"
import MultiSelect from "@/app/Components/MultiSelect"

export default function Home() {

  const [selectedYearHc, setSelectedYearHc] = useState(null);
  const [selectedMonthHc, setSelectedMonthHc] = useState(null);
  const [selectedMonthC, setSelectedMonthC] = useState(null);

  // Función general para manejar el cambio en cualquier select
  const handleSelectChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  function generateYears() {
    let currentYear = new Date().getFullYear();
    let years = [];
    for (let year = 1981; year < currentYear; year++) {
      years.push(year);
    }
    return years;
  }

  const meses = [
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
  ];

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
              input={<OutlinedInput label={"Año"}
              value={selectedYearHc}
              onChange={handleSelectChange(setSelectedYearHc)} />}>
                {generateYears() &&
                  generateYears().length > 0 &&
                  generateYears().map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 60, width: "30%" }} size="small">
              <InputLabel id="select_month_hc">{"Mes"}</InputLabel>
              <Select
              labelId="select_month_hc"
              input={<OutlinedInput label={"Mes"}
              value={selectedMonthHc}
              onChange={handleSelectChange(setSelectedMonthHc)} />}>
                {meses.map((d, i) => (
                  <MenuItem key={i} value={i}>
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
            month={selectedMonthHc}
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
            <FormControl sx={{ m: 1, minWidth: 60, width: "30%" }} size="small">
              <InputLabel id="select_month">{"Mes"}</InputLabel>
              <Select
              labelId="select_month"
              input={<OutlinedInput label={"Mes"}
              value={selectedMonthC}
              onChange={handleSelectChange(setSelectedMonthC)}
               />}>
                {meses.map((d, i) => (
                  <MenuItem key={i} value={i}>
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
            <MultiSelect arrayData={generateYears()} label={"Años analogos"} />
          </div>
          {/* <Map
            className={styles.map}
            zoom={7}
            center={[14.5007343, -86.6719949]}
            url={Configuration.get_geoserver_url()}
          /> */}
        </div>
      </div>
    </main>
  );
}
