import React from "react";
import "./landing.css";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/hero.jpeg";

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="work">Work</span>
          <span className="link">Link</span>
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Testimonials</li>
          <li>Contact</li>
        </ul>

     <button
className="login-btn"
onClick={()=>navigate("/login")}
>
<span className="arrow">→</span> Log In
</button>
      </nav>

      {/* HERO SECTION */}

      <section className="hero-section">

        <h1 className="hero-title">
          Bridge the gap between <br />
          <span>Skills & Career</span>
        </h1>

        <p className="hero-text">
          A unified platform that connecting training institutes, job seekers
          and employers. From skill development to placement – all in one
          ecosystem.
        </p>

        <div className="hero-image-wrapper">
          <img src={heroImage} alt="team working" />
        </div>

        <button className="start-btn">
          <span>→</span> Get Started
        </button>

      </section>

    </div>
  );
}

export default Landing;