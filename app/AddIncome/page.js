"use client";
import { useState } from "react";
import { supabase } from "@/supabase";
import Navbar from "@/components/Navbar";

function AddIncome() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("income")
      .insert([{ amount, description, date, source }]);
    if (error) console.error(error);
    else alert("Income added successfully");
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Add a New Income
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                aria-label="Date"
              />
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                aria-label="Amount"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Income description"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                aria-label="Description"
              />
            </div>

            {/* Source Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Source
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source (e.g. Salary, Investment)"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
                aria-label="Source"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out"
            >
              Add Income
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddIncome;
