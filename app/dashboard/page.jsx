"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
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