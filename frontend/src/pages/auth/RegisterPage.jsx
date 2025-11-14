// frontend/src/pages/auth/RegisterPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/App.css"; // ensure global styles loaded

export default function RegisterPage() {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (event) => {
    if (busy) return; // prevent double click
    event.preventDefault();
    setBusy(true);
    setErrMsg("");
    try {
      // Use actual password if your backend needs it;
      await auth.register({ email, password });
    } catch (error) {
      setErrMsg(error?.response?.data?.message || error.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-root centered-auth">
      {/* top-left brand matches homepage */}
      <div className="auth-top-brand">
        <div className="hb-brand">HaBiD</div>
      </div>

      <div className="auth-card--wrap">
        <div className="auth-card auth-card--centered">
          <h1 className="auth-title">Sign up</h1>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <label className="field">
              <div className="label small"><span className="icon">✉️</span> Email</div>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </label>

            <label className="field">
              <div className="label small"><span className="icon">🔒</span> Password</div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Enter your password"
              />
            </label>

            {errMsg && <div className="error">{errMsg}</div>}

            <div className="actions column">
              <button type="submit" className="btn primary large" disabled={busy}>
                {busy ? "Creating..." : "Continue with email"}
              </button>

              <div className="divider" />

              <button type="button" className="btn provider">Continue with Google</button>
              <button type="button" className="btn provider">Continue with Phone Number</button>
            </div>
          </form>

          <div className="small-toggle">
            Already have an account?{" "}
            <Link to="/login" className="link-toggle">Sign in</Link>
          </div>

          <div className="legal">
            <p>Thêm một đoạn văn ngắn filler vào đây để cân đối. Kiểu như khi đăng nhập đồng nghĩa với việc quý khách đã chấp nhận điều khoản dịch vụ.</p>
            <p>Bản quyền thuộc về HTD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
