"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [step, setStep] = useState(1);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) router.push("/forgot-password");
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP Verified");
        setStep(2);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("OTP sent again");
        setCooldown(60);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        <p className="text-center text-sm text-gray-500 mb-4">{email}</p>

        {step === 1 && (
          <>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              className="w-full border p-2 rounded mb-3 text-center text-lg tracking-widest"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resending}
                className="text-sm text-blue-600 disabled:text-gray-400"
              >
                {resending
                  ? "Resending..."
                  : cooldown > 0
                    ? `Resend OTP in ${cooldown}s`
                    : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        {message && (
          <p className="text-center text-sm mt-3 text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
}
