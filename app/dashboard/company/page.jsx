"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateCompanyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });

  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          users: selectedUserIds,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Company created successfully!" });

        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Create New Company
            </h1>
            <p className="text-indigo-100 text-center mt-1">
              Register your business and assign team members
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Company Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="contact@acme.com"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Assign Users
                </h2>
                <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {selectedUserIds.length} Selected
                </div>
              </div>

              <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="selectAll"
                  onChange={handleSelectAll}
                  checked={
                    users.length > 0 && selectedUserIds.length === users.length
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="selectAll"
                  className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Select All Users
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {fetchingUsers ? (
                  <div className="col-span-2 text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <p className="col-span-2 text-center py-8 text-gray-500">
                    No users found.
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedUserIds.includes(user.id)
                          ? "bg-indigo-50 border-indigo-200 shadow-sm"
                          : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => {}} // Handled by div click
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {message.text && (
              <div
                className={`p-4 rounded-lg text-sm font-medium text-center ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Company"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
