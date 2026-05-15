"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans dark:from-zinc-900 dark:via-black dark:to-zinc-950 p-6">
      <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Main Welcome Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

          <div className="relative px-8 py-12 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-2xl shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
              {user ? `Welcome back, ${user.name}` : "Welcome to our Platform"}
            </h1>

            {user?.Companies?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {user.Companies.map((company) => (
                  <div
                    key={company.id}
                    className="relative p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* <div className="absolute top-4 right-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div> */}
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {company.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                      {company.email}
                    </p>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                          Registered By
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            {company.owner?.name?.charAt(0) || "A"}
                          </div>
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {company.owner?.name || "Admin"}
                          </span>
                        </div>
                      </div>
                      {company.location && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block mb-1">
                            Location
                          </span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {company.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-10">
              We're glad to have you here. Explore your personalized dashboard
              and manage your workspace effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <>
                  {/* <button 
                    onClick={() => router.push(user.role === 'admin' ? '/dashboard' : '/profile')}
                    className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
                  >
                    Go to Dashboard
                  </button> */}
                  <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Info Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
           <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Secure</h3>
              <p className="text-sm text-zinc-500">Your data is always encrypted.</p>
           </div>
           <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Fast</h3>
              <p className="text-sm text-zinc-500">Built with Next.js for speed.</p>
           </div>
           <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Scale</h3>
              <p className="text-sm text-zinc-500">Ready for enterprise workloads.</p>
           </div>
        </div> */}
      </div>
    </div>
  );
}
