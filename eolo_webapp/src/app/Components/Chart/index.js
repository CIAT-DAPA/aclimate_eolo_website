import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartReport = ({ data, type, colors, titles, second_data=[] }) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "bar",
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
        },
      },
    },
    series: [
      {
        name: "Probabilidades",
        data: [0, 0, 0],
      },
    ],
  });
  const [chartLineData, setCharLinetData] = useState({
    series: [
      {
        name: "Website Blog",
        type: "column",
        data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
      },
      {
        name: "Social Media",
        type: "line",
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          distributed: true,
        },
      },
      colors: colors,
      legend: {
        show: false,
      },
      stroke: {
        width: [0, 4],
      },
      xaxis: {
        categories: titles,
      },
      yaxis: [
        {
          title: {
            text: "Precipitación (%)",
          },
        }
      ],
    },
  });

  useEffect(() => {
    if (type == "line") {
      setCharLinetData({
        series: [
          {
            name: "Probabilidades",
            type: "column",
            data: data,
          },
          {
            name: "Norma Historica",
            type: "line",
            data: second_data,
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "line",
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              borderRadiusApplication: "end",
              distributed: true,
            },
          },
          colors: colors,
          legend: {
            show: false,
          },
          stroke: {
            width: [0, 4],
          },
          xaxis: {
            categories: titles,
          },
          yaxis: [
            {
              title: {
                text: "Precipitación (%)",
              },
            }
          ],
        },
      })
    } else {
      if (data && data.length > 0) {
        setChartData({
          options: {
            chart: {
              type: "bar",
              id: "basic-bar",
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
              },
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
    }
  }, [data]);

  return (
    <div className="mixed-chart">
      <Chart
        options={type == "line" ? chartLineData.options : chartData.options}
        series={type == "line" ? chartLineData.series : chartData.series}
        type={type}
        width="500"
      />
    </div>
  );
};

export default ChartReport;
