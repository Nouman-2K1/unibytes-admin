"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import Navbar from "@/components/Navbar";

function IncomeExpenseList() {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: incomeData } = await supabase.from("income").select("*");
        const { data: expenseData } = await supabase
          .from("expenses")
          .select("*");
        setIncomeList(incomeData);
        setExpenseList(expenseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Income and Expense List
        </h2>

        {/* Income Table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Income</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Source</th>
                </tr>
              </thead>
              <tbody>
                {incomeList.map((income, index) => (
                  <tr
                    key={income.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-blue-100 transition`}
                  >
                    <td className="p-3">{income.date}</td>
                    <td className="p-3">${income.amount}</td>
                    <td className="p-3">{income.description || "N/A"}</td>
                    <td className="p-3">{income.source || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Table */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Expenses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {expenseList.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-red-100 transition`}
                  >
                    <td className="p-3">{expense.date}</td>
                    <td className="p-3">${expense.amount}</td>
                    <td className="p-3">{expense.description || "N/A"}</td>
                    <td className="p-3">{expense.category || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default IncomeExpenseList;
