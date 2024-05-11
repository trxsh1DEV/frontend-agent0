import React, { useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { data, historyData } from "./mock";

const Charts: React.FC = () => {
  // Labels para o eixo X
  const labels = historyData.map((values, _) => `${values.day}`);

  // Dados para os gráficos
  const historyCPUUsage = historyData.map((data) => data.cpu_usage);
  const historyRAMUsage = historyData.map((data) => data.ram_usage);
  const historyCPUTemperature = historyData.map((data) => data.cpu_temperature);
  const historyDiskSpace = historyData.map(
    (data) => (data.free_disk_space / data.total_disk_space) * 100
  );

  useEffect(() => {
    // Definindo as cores com base nos dados
    const getColor = (value: number) => {
      let red, green, blue, alpha;

      if (value < 50) {
        red = 0;
        green = 255 * (value / 50);
        blue = 0;
      } else if (value <= 80) {
        // Amarelo para Vermelho
        red = 255 * ((value - 50) / 30);
        green = 255;
        blue = 0;
      } else {
        // Vermelho
        red = 255;
        green = 255 - 255 * ((value - 80) / 20);
        blue = 0;
      }

      alpha = Math.min(1, value / 20); // Limite máximo de opacidade em 1
      console.log(green);

      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    };

    // CPU and RAM Bars Chart
    const cpuRamBarsCtx = document.getElementById(
      "cpuRamBars"
    ) as HTMLCanvasElement;
    new Chart(cpuRamBarsCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "CPU Usage (%)",
            data: historyCPUUsage,
            backgroundColor: historyCPUUsage.map((value) => getColor(value)),
            borderColor: historyCPUUsage.map((_) => "transparent"),
            borderWidth: 1,
          },
          {
            label: "RAM Usage (%)",
            data: historyRAMUsage,
            backgroundColor: historyRAMUsage.map((value) => getColor(value)),
            borderColor: historyRAMUsage.map((_) => "transparent"),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Disk Space Pie Chart
    const diskSpacePieCtx = document.getElementById(
      "diskSpacePie"
    ) as HTMLCanvasElement;
    new Chart(diskSpacePieCtx, {
      type: "pie",
      data: {
        labels: ["Free Space", "Used Space"],
        datasets: [
          {
            data: [
              data.free_disk_space,
              data.total_disk_space - data.free_disk_space,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
  }, []);

  // Gauge
  const gaugeOptions = {
    minValue: 0,
    maxValue: 100,
    nrOfLevels: 30,
    colors: ["#FF5F6D", "#7DDA58"],
    arcWidth: 0.3,
    // label: { text: "CPU Temperature", color: "#000000" },
  };

  const cpuTemperatureGauge = (
    <GaugeChart
      id="cpuTemperatureGauge"
      percent={data.cpu_temperature / 100}
      {...gaugeOptions}
    />
  );
  const memGabage = (
    <GaugeChart
      id="memGabage"
      percent={data.ram_usage / 100}
      {...gaugeOptions}
    />
  );
  const cpuUsage = (
    <GaugeChart
      id="cpuUsage"
      percent={data.cpu_usage / 100}
      {...gaugeOptions}
    />
  );
  const diskUsage = (
    <GaugeChart
      id="diskUsage"
      percent={data.free_disk_space / data.total_disk_space}
      {...gaugeOptions}
    />
  );

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <div>
          <p>CPU</p>
          {cpuTemperatureGauge}
        </div>
        <div>
          <p>Memory</p>
          {memGabage}
        </div>
        <div>
          <p>CPU Usage</p>
          {cpuUsage}
        </div>
        <div>
          <p>Disk Usage</p>
          {diskUsage}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
        }}
      >
        <canvas id="cpuRamBars"></canvas>
        <canvas id="diskSpacePie"></canvas>
      </div>
      <div>
        <Line
          data={{
            labels: labels,
            datasets: [
              {
                label: "CPU Usage (%)",
                data: historyCPUUsage,
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "RAM Usage (%)",
                data: historyRAMUsage,
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                label: "CPU Temperature (°C)",
                data: historyCPUTemperature,
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 1,
              },
              {
                label: "Disk Space (Free/Total)",
                data: historyDiskSpace,
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Charts;
