import React from "react";
import { useNavigate } from "react-router-dom";
import "./Recruiter-home.css";

function Recruiter() {
      const navigate = useNavigate();
  return (
    <div className="recruiter-page">

      {/* NAVBAR */}
      <nav className="recruiter-navbar">

        <div className="recruiter-logo">
          WorkLink
        </div>

        <ul className="recruiter-menu">
          <li>Job Posting</li>
          <li>Candidates</li>
          <li>Interview Status</li>
          <li className="active">Shortlisted</li>
        </ul>

      </nav>

      {/* HERO */}

      <div className="recruiter-hero">

        <h1>
          Hire Smarter! <br />
          Hire Skilled
        </h1>

        <button
      className="recruiter-btn"
      onClick={() => navigate("/recruiter-dashboard")}
    >
      Get Started
    </button>

      </div>

    </div>
  );
}

export default Recruiter;