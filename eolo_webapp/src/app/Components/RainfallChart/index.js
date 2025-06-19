"use client";
import { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import Loading from "../Loading";

const RainfallChart = ({
  months,
  departments,
  rainfallData,
  selectedDepartment,
  setSelectedDepartment,
  colors,
  currentLoadingChart,
}) => {
  const chartRef = useRef(null);
  const handleSelectChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const [chartConfig, setChartConfig] = useState({
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: "Precipitación (mm/mes)",
      },
    },
    title: {
      text: `Lluvia en ${selectedDepartment} (1990–2020)`,
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    legend: {
      show: false,
    },
    colors: colors,
  });

  const chartSeries = [
    {
      name: "Precipitación",
      data: rainfallData[selectedDepartment],
    },
  ];

  useEffect(() => {
    setSelectedDepartment(departments[0]);
  }, [departments]);

  useEffect(() => {
    setChartConfig((prev) => ({
      ...prev,
      colors: colors,
    }));
  }, [colors, selectedDepartment]);

  return (
    <Box>
      <FormControl sx={{ mb: 2, width: "100%" }} size="small">
        <InputLabel id="select-dep">Departamento</InputLabel>
        <Select
          labelId="select-dep"
          value={selectedDepartment}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Departamento" />}
          disabled={!(departments.length > 2)}
        >
          {departments.map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {currentLoadingChart && colors ? (
        <Loading height="350px" />
      ) : (
        <Chart
          key={colors.join()}
          options={chartConfig}
          series={chartSeries}
          type="bar"
          height={350}
        />
      )}
    </Box>
  );
};

export default RainfallChart;
