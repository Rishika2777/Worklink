import React from "react";
import "./welcome.css";
import { useNavigate, useLocation } from "react-router-dom";
import robot from "../../assets/images/robot-login.png";

function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  /** Set when navigating here after full onboarding (role-specific dashboard next). */
  const nextPath = location.state?.next || "/role-selection";
  const ctaLabel =
    nextPath === "/student-dashboard" ? "Get Started →" : "Next →";

  return (
    <div className="welcome-page">

      <div className="welcome-container">

        {/* ROBOT */}
        <div className="welcome-robot">
          <img src={robot} alt="robot" />
        </div>

        {/* TEXT AREA */}
        <div className="welcome-text">

          <h2 className="welcome-title">
            Welcome to
          </h2>

          <h1 className="welcome-brand">
            <span className="welcome-work">Work</span>
            <span className="welcome-link">Link</span>
          </h1>

          <p className="welcome-subtitle">
            TECHNOLOGIES
          </p>

          <button
            type="button"
            className="next-btn"
            onClick={() => navigate(nextPath, { replace: true })}
          >
            {ctaLabel}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Welcome;