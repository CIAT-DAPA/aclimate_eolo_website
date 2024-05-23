import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartReport = ({ data, type, colors, titles, monthTitles = [], anomalie=true }) => {
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

  useEffect(() => {
    if (type == "clima") {
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
            title: {
              text: "Precipitación",
            },
          },
        },
        series: [
          {
            name: "Precipitación",
            data: data,
          },
        ],
      });
    } else if (type == "proba") {
      const ab = {
        name: titles[0],
        data: []
      }
      const nor = {
        name: titles[1],
        data: []
      }
      const bel = {
        name: titles[2],
        data: []
      }
      data.forEach((d, index) => {
        if (index % 3 === 0) {
          ab.data.push(d)
        } else if (index % 3 === 1) {
          nor.data.push(d)
        } else if (index % 3 === 2) {
          bel.data.push(d)
        }
      })
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
              
            },
          },
          colors: colors,
          stroke: {
            colors: ["transparent"],
            width: 5
          },
          xaxis: {
            categories: monthTitles,
          },
          legend: {show: true},
          yaxis: {
            max: 100,
            title: {
              text: "Probabilidad (%)",
            },
          },
        },
        series: anomalie ? [ab, nor, bel] :  [ab]
        
      });
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
        options={chartData.options}
        series={chartData.series}
        type={"bar"}
        width="650"
        height="420"
      />
    </div>
  );
};

export default ChartReport;
