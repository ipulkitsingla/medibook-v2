"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStethoscope } from "react-icons/fa";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/doctor-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      router.push("/doctor-portal/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="portal-login-page">
      <div className="portal-login-card">
        <div className="portal-login-icon">
          <FaStethoscope />
        </div>
        <h1 className="portal-login-title">Doctor Portal</h1>
        <p className="portal-login-sub">Sign in to manage your appointments</p>

        <div className="ap-input-group" style={{ width: "100%", marginBottom: 16 }}>
          <label className="ap-label">Email</label>
          <div className="ap-input-wrapper">
            <span className="ap-input-icon"><IoMailOutline /></span>
            <input
              type="email"
              className="ap-input"
              placeholder="doctor@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

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

        {error && <p className="error" style={{ marginBottom: 16 }}>{error}</p>}

        <button
          className="btn-primary"
          style={{ width: "100%", padding: "12px", fontSize: 15 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="portal-login-hint">
          Don&apos;t have credentials? Ask your hospital admin to register your account via the API.
        </p>
      </div>
    </div>
  );
}
