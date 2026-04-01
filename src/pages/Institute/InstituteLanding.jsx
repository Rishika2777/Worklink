import "./InstituteLanding.css";
import { useNavigate } from "react-router-dom";

function InstituteLanding() {

  const navigate = useNavigate();

  return (
    <div className="institute-landing">

      {/* HEADER */}

      <div className="landing-header">

        <h2 className="logo">
          WorkLink
        </h2>

        <button className="contact-btn">
          Contact Us
        </button>

      </div>


      {/* HERO SECTION */}

      <div className="landing-content">

        <h1>
          Transform Learners <br/>
          From Training to Talent!
        </h1>

        <p>
          A centralized dashboard that helps training institutes manage courses,
          track student progress, create assessment & analyze performance in one place.
        </p>

        <button
          className="get-started"
          onClick={() => navigate("/institute-dashboard")}
        >
          Get Started
        </button>

      </div>

    </div>
  );
}

export default InstituteLanding;