"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PiHospitalBold } from "react-icons/pi";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form fields
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    // Simple check before sending to server
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Server returned an error (wrong password, etc.)
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Success — go to the dashboard
      router.push("/hospital-admin/dashboard");

    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-login-page">
      <div className="portal-login-card">

        {/* Icon at the top */}
        <div className="portal-login-icon" style={{ background: "#e8f0ff", color: "#4f6ef7" }}>
          <PiHospitalBold />
        </div>

        <h1 className="portal-login-title">Hospital Admin</h1>
        <p className="portal-login-sub">Sign in to manage your hospital</p>

        {/* Email field */}
        <div className="ap-input-group" style={{ width: "100%", marginBottom: 16 }}>
          <label className="ap-label">Email</label>
          <div className="ap-input-wrapper">
            <span className="ap-input-icon"><IoMailOutline /></span>
            <input
              type="email"
              className="ap-input"
              placeholder="admin@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="ap-input-group" style={{ width: "100%", marginBottom: 24 }}>
          <label className="ap-label">Password</label>
          <div className="ap-input-wrapper">
            <span className="ap-input-icon"><IoLockClosedOutline /></span>
            <input
              type="password"
              className="ap-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        {/* Show error if any */}
        {error && <p className="error" style={{ marginBottom: 16 }}>{error}</p>}

        {/* Login button */}
        <button
          className="btn-primary"
          style={{ width: "100%", padding: "12px", fontSize: 15, background: "#4f6ef7" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="portal-login-hint">
          First time? Register your hospital admin account using the API, then log in here.
        </p>

      </div>
    </div>
  );
}
