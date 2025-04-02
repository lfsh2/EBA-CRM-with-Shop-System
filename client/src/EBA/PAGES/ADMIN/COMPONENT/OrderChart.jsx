import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders-data")
      .then((response) => {
        setChartData({
          labels: response.data.labels,
          datasets: response.data.datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor: ["#FFC107", "#4CAF50", "#F44336"][index],
          })),
        });
      })
      .catch((error) => console.error("Error fetching orders data:", error));
  }, []);

  return chartData ? <Bar data={chartData} /> : <p>Loading...</p>;
};

export default OrdersChart;
