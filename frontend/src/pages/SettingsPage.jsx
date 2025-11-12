// frontend/src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/App.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    try {
      setBusy(true);
      // Prefer auth.logout if provided by your hook
      if (auth && typeof auth.logout === "function") {
        await auth.logout();
        // auth.logout() may redirect itself; guard fallback below
        return;
      }

      // Fallback: clear token & redirect
      localStorage.removeItem("auth_token");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Sign out failed", err);
      // still redirect
      localStorage.removeItem("auth_token");
      navigate("/login", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-root centered-auth" style={{ paddingTop: 80 }}>
      <div className="auth-top-brand">
        <div className="hb-brand">HaBiD</div>
      </div>

      <div className="auth-card--wrap">
        <div className="auth-card auth-card--centered" style={{ maxWidth: 420 }}>
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Settings</h2>
          <p style={{ color: "#9aa7b3", marginBottom: 18 }}>Account & session</p>

          <div style={{ display: "flex", gap: 12, flexDirection: "column", width: "100%" }}>
            <button
              className="btn primary large"
              onClick={handleSignOut}
              disabled={busy}
            >
              {busy ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
