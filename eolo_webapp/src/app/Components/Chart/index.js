import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartReport = ({ data, type }) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      colors: ['#0d6efd', '#20c997', '#ffc107', '#FF4560'],
      xaxis: {
        categories: [
          "Encima de lo normal",
          "Normal",
          "Debajo de lo normal",
          "Mayor probabilidad",
        ],
      },
    },
    series: [
      {
        name: "Probabilidades",
        data: [0, 0, 0, 0],
      },
    ],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData({
        options: {
          chart: {
            id: "basic-bar",
          },
          colors: ['#0d6efd', '#20c997', '#ffc107', '#FF4560'],
          xaxis: {
            categories: [
              "Encima de lo normal",
              "Normal",
              "Debajo de lo normal",
              "Mayor probabilidad",
            ],
          },
        },
        series: [
          {
            name: "Probabilidades",
            data: data,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="mixed-chart">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="500"
      />
    </div>
  );
};

export default ChartReport;
