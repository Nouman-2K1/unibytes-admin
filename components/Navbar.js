"use client";

import { supabase } from "../supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Unibytes Admin</h1>

        <div className="flex space-x-4">
          <a
            href="/IncomeExpenceList"
            className="bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md text-sm font-medium"
          >
            List
          </a>
          <a
            href="/dashboard2"
            className="bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md text-sm font-medium"
          >
            Chart
          </a>
          <a
            href="/AddExpence"
            className="bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Expense
          </a>
          <a
            href="/AddIncome"
            className="bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Income
          </a>

          <a
            href="/dashboard"
            className="bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md text-sm font-medium"
          >
            Contact
          </a>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
