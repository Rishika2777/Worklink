import React, { useState } from "react";
import "./authFlowTheme.css";
import "./login.css";
import { useNavigate } from "react-router-dom";
import robot from "../../assets/images/robot-login.png";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { AuthFlowStepIndicator } from "./AuthFlowStepIndicator";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-flow-page">
      <div className="login-shell">
        <AuthFlowStepIndicator activeIndex={0} />

        <div className="login-card">
          <div className="login-robot-wrap">
            <img src={robot} alt="" className="login-robot-img" />
          </div>

          <h1 className="login-title">Welcome Back</h1>
          <p className="login-lead">Sign in to your account to continue</p>

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <button
              type="button"
              className="login-oauth-google"
              onClick={() => navigate("/login/google")}
            >
              <span className="login-oauth-g-icon" aria-hidden>
                G
              </span>
              Continue with Google
            </button>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <div className="login-input">
              <span className="login-input-icon">
                <FiMail aria-hidden />
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
              />
            </div>

            <div className="login-input login-input--with-toggle">
              <span className="login-input-icon">
                <FiLock aria-hidden />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="login-forgot-row">
              <button
                type="button"
                className="login-link-muted"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
            </div>

            <button
              className="login-btn-primary"
              type="button"
              onClick={() => navigate("/role-selection")}
            >
              Sign In
            </button>

            <p className="login-footer">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="login-link-signup"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
