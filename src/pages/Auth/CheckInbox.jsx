import React from "react";
import "./authFlowTheme.css";
import "./CheckInbox.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import { AuthFlowStepIndicator } from "./AuthFlowStepIndicator";

function CheckInbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    location.state?.email || "johndoe88@gmail.com";

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-shell">
        <AuthFlowStepIndicator activeIndex={3} />

        <div className="auth-flow-card check-inbox-card">
          <div className="check-inbox-icon-wrap" aria-hidden>
            <FiKey className="check-inbox-key" />
          </div>

          <h1 className="check-inbox-title">Check your Inbox</h1>
          <p className="check-inbox-lead">
            We&apos;ve sent a reset link to{" "}
            <span className="check-inbox-email">{email}</span>
          </p>

          <button
            type="button"
            className="check-inbox-primary"
            onClick={() => navigate("/login")}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckInbox;
