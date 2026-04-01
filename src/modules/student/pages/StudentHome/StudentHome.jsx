import "./StudentHome.css";
import { FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function StudentHome() {

const navigate = useNavigate();

  return (
    <div className="student-home">

      {/* NAVBAR */}

      <nav className="student-navbar">

        <div className="student-logo">
          <span className="work">Work</span>
          <span className="link">Link</span>
        </div>

        <button className="contact-btn">
          <FiArrowRight />
          Contact Us
        </button>

      </nav>


      {/* HERO SECTION */}

      <div className="student-hero">

        <div className="trusted">
          <MdSchool className="trusted-icon"/>
          Trusted by over 50,000+ Students
        </div>

        <h1>
          One Platform with <br/>
          <span>Endless Opportunities</span>
        </h1>

        <p>
          Transform your career & learn with our AI-driven learning management
          system, manage courses, track progress and get hired today.
        </p>

        <button
          className="start-btn"
          onClick={()=>navigate("/student-dashboard")}
        >
          <FiArrowRight/>
          Get Started for Free
        </button>


        {/* RATINGS */}

        <div className="ratings">

          <span className="brand">Cisco</span>

          <div className="stars">
            <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/>
          </div>

          <span>4.5/5 Clutch</span>

          <div className="stars">
            <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/>
          </div>

          <span>4.5/5</span>

        </div>

      </div>

    </div>
  );
}

export default StudentHome;