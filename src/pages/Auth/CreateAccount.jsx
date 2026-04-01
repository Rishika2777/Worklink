import React, { useState } from "react";
import "./authFlowTheme.css";
import "./CreateAccount.css";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { AuthFlowStepIndicator } from "./AuthFlowStepIndicator";

function CreateAccount() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) return;
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      return;
    }
    navigate("/onboarding");
  }

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-shell">
        <div className="auth-flow-card create-account-card">
          <div className="create-account-steps">
            <AuthFlowStepIndicator activeIndex={2} />
          </div>

          <h1 className="create-account-title">Create Account</h1>
          <p className="create-account-subtitle">
            Fill in your details to get started
          </p>

          <form className="create-account-form" onSubmit={handleSubmit}>
            <div className="create-account-field">
              <span className="create-account-icon">
                <FiUser aria-hidden />
              </span>
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="create-account-field">
              <span className="create-account-icon">
                <FiMail aria-hidden />
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="create-account-field create-account-field--phone">
              <span className="create-account-icon">
                <FiPhone aria-hidden />
              </span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Phone number (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <span className="create-account-phone-star" aria-hidden>
                *
              </span>
            </div>

            <div className="create-account-field create-account-field--toggle">
              <span className="create-account-icon">
                <FiLock aria-hidden />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Create Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="create-account-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <label className="create-account-terms">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <button type="button" className="create-account-inline-link">
                  Terms of Services
                </button>{" "}
                and{" "}
                <button type="button" className="create-account-inline-link">
                  privacy Policy
                </button>
              </span>
            </label>

            <button
              type="submit"
              className="create-account-submit"
              disabled={!agreed}
            >
              Create account
            </button>

            <p className="create-account-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="create-account-signin-link"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
