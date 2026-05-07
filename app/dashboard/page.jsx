"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">

        <h1 className="text-3xl font-bold mb-4">
          Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome! You are logged in successfully.
        </p>

        {/* User Information */}
        {user && (
          <div className="bg-gray-100 p-4 rounded mb-6 text-left">
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>

            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}