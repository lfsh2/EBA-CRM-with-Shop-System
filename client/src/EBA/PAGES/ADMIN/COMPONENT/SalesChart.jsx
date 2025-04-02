import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sales-data")
      .then((response) => {
        setChartData({
          labels: response.data.labels,
          datasets: response.data.datasets.map((dataset, index) => ({
            ...dataset,
            borderColor: ["#2196F3", "#9C27B0", "#FF9800"][index],
            backgroundColor: "transparent",
            tension: 0.4,
          })),
        });
      })
      .catch((error) => console.error("Error fetching sales data:", error));
  }, []);

  return chartData ? <Line data={chartData} /> : <p>Loading...</p>;
};

export default SalesChart;
