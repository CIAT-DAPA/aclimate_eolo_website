import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartReport = ({ data, type, colors, titles }) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: type,
        id: "basic-bar",
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          distributed: true,
        },
      },
      colors: colors,
      xaxis: {
        categories: titles,
      },
      yaxis: {
        max: 100,
        title: {
          text: "Probabilidad (%)",
        }
      },
    },
    series: [
      {
        name: "Probabilidades",
        data: [0, 0, 0],
      },
    ],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData({
        options: {
          chart: {
            type: type,
            id: "basic-bar",
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              borderRadiusApplication: "end",
            },
          },
          colors: colors,
          xaxis: {
            categories: titles,
          },
          yaxis: {
            max: 100,
            title: {
              text: "Probabilidad (%)",
            }
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
