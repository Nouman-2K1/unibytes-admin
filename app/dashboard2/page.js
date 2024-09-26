"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { supabase } from "@/supabase";
import Navbar from "@/components/Navbar";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard2() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: income, error: incomeError } = await supabase
          .from("income")
          .select("amount");

        const { data: expenses, error: expenseError } = await supabase
          .from("expenses")
          .select("amount");

        if (incomeError) throw incomeError;
        if (expenseError) throw expenseError;

        // Calculate total income and expenses
        const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.reduce(
          (acc, curr) => acc + curr.amount,
          0
        );

        setIncomeData([totalIncome]);
        setExpenseData([totalExpenses]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Total",
        data: [...incomeData, ...expenseData],
        backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "$" + value,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"
          role="status"
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white p-8 mt-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Financial Overview
        </h2>
        <div className="w-full overflow-x-auto">
          <Bar data={data} options={options} />
        </div>
      </div>
    </>
  );
}

export default Dashboard2;
