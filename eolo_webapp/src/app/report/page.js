"use client";
import Loading from "../Components/Loading";
import styles from "./report.module.css";
import { useState } from "react";
import useAuth from "../Hooks/useAuth";
import Configuration from "../config";
import {
  OutlinedInput,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";

const Report = () => {
  const { loading, auth } = useAuth();
  const [forecastSelected, setForecastSelected] = useState("");
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
        </>
      )}
    </main>
  );
};

export default Report;
