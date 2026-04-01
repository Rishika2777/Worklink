import React, { useState } from "react";
import "./authFlowTheme.css";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import { FiKey, FiMail } from "react-icons/fi";
import { AuthFlowStepIndicator } from "./AuthFlowStepIndicator";

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSend(e) {
    e.preventDefault();
    if (!email.trim()) return;
    navigate("/reset-password/check-inbox", {
      state: { email: email.trim() },
    });
  }

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-shell">
        <AuthFlowStepIndicator mode="dotsOnly" />

        <div className="auth-flow-card reset-password-card">
          <div className="reset-password-icon-wrap" aria-hidden>
            <FiKey className="reset-password-key" />
          </div>

          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-lead">
            Enter your email and We&apos;ll send you a reset link
          </p>

          <form className="reset-password-form" onSubmit={handleSend}>
            <div className="reset-password-field">
              <span className="reset-password-icon">
                <FiMail aria-hidden />
              </span>
              <input
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="reset-password-submit">
              Send reset link
            </button>

            <button
              type="button"
              className="reset-password-back"
              onClick={() => navigate("/login")}
            >
              ← Back Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
