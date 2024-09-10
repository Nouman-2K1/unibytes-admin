"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOptions] = useState([
    "New",
    "Prospect",
    "Pitching",
    "Secured Lead",
    "Proposal Sent",
    "Closed - Win",
    "Closed - lost",
  ]);

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
        fetchContacts(); // Moved to be accessible globally
      }
    };

    checkSession();
  }, [router, page, searchQuery]);

  // Fetch contacts outside useEffect to ensure other functions can use it
  const fetchContacts = async () => {
    setLoading(true);
    const { data, count, error } = await supabase
      .from("Contact") // Ensure correct table name here
      .select("*", { count: "exact" })
      .ilike("name", `%${searchQuery}%`)
      .order("id", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      setContacts(data);
      setTotalPages(Math.ceil(count / pageSize));
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("Contact") // Ensure correct table name here
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      fetchContacts(); // Ensure contact data is refreshed after update
    }
  };

  const deleteContact = async (id) => {
    const { error } = await supabase
      .from("Contact") // Ensure correct table name here
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting contact:", error);
    } else {
      fetchContacts(); // Ensure contact data is refreshed after deletion
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page when searching
  };

  if (!user) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Contacts Dashboard</h2>

        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search by name"
            className="px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Message</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} className="border-b">
                  <td className="py-2 px-4">{contact.name}</td>
                  <td className="py-2 px-4">{contact.email}</td>
                  <td className="py-2 px-4">{contact.subject}</td>
                  <td className="py-2 px-4">{contact.message}</td>
                  <td className="py-2 px-4">
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact.id, e.target.value)}
                      className="border rounded-md px-2 py-1"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded-md"
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 border rounded-md"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
