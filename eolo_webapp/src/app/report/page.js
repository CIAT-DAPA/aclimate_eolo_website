"use client";
import Loading from "../Components/Loading";
import styles from "./report.module.css";
import { useState } from "react";
import useAuth from "../Hooks/useAuth";
import Configuration from "../config";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CsvTable from "../Components/Table";
import ChartReport from "../Components/Chart";
import {
  OutlinedInput,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";

const Report = () => {
  const { loading, auth } = useAuth();
  const [forecastSelected, setForecastSelected] = useState("");
  const [data, setData] = useState([]);
  const [titles, setTitles] = useState([
    "Región",
    "Encima de lo normal",
    "Normal",
    "Debajo de lo normal",
    "Mayor probabilidad",
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

  const handleSelectChange = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  return (
    <main className={styles.main}>
      {loading || !auth ? (
        <Loading />
      ) : (
        <>
          <Box>
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
          </Box>
          <Typography
            variant="h3"
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
                color="textSecondary"
                className={styles.card_text}
              >
                {`Vestibulum varius maximus odio, vitae porttitor metus lobortis
                  in. Sed ut hendrerit tortor, non lobortis ex. Suspendisse
                  sagittis sollicitudin lorem, quis ornare eros tempor congue`}
              </Typography>
            </Box>
            <Box>
              <ChartReport
                data={[]}
                type="bar"
                width="500"
              />
            </Box>
            <Box>
              <ChartReport
                data={[]}
                type="bar"
                width="500"
              />
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
                  color="textSecondary"
                  className={styles.card_text}
                >
                  {`Vestibulum varius maximus odio, vitae porttitor metus lobortis
                  in. Sed ut hendrerit tortor, non lobortis ex. Suspendisse
                  sagittis sollicitudin lorem, quis ornare eros tempor congue`}
                </Typography>
                <Button
                  startIcon={<UploadFileIcon />}
                  style={{
                    width: "20%",
                    backgroundColor: "#e37b13",
                    color: "#ffff",
                    height: "42px",
                    borderRadius: "6px",
                  }}
                >
                  Cargar CSV
                </Button>
              </Box>
              <Box>
                <CsvTable titles={titles} data={data} />
              </Box>
            </Box>
          </Box>
          <Button
            startIcon={<PictureAsPdfIcon />}
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
    </main>
  );
};

export default Report;
