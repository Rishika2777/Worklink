import "./CandidateDetails.css";

function CandidateDetails({ onBack }) {
  return (
    <div className="details-wrapper">

      <button className="back-btn" onClick={onBack}>←</button>

      <div className="details-card">

        {/* LEFT */}
        <div className="details-left">

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="profile-img"
          />

          <h4>Contact</h4>

          <p>📞 6268****16</p>
          <p>📧 rimeemodi87@gmail.com</p>
          <p>📍 Bhopal, M.P</p>

          <hr/>

          <h4>Education</h4>
          <p>Medi-Caps University</p>
          <p>Indore, M.P</p>
          <p>Masters in Computer Application</p>
          <p>2024-2026</p>

        </div>

        {/* RIGHT */}
        <div className="details-right">

          <h2>Rimee Modi</h2>
          <p className="role">UI/UX Designer</p>

          <p className="desc">
            I bring an engineering perspective and creative problem solving approach
            to create products and crafting experiences people love to love.
          </p>

          <p className="quote">
            "Design is thinking made Visual"
          </p>

          <h4>Skills</h4>
          <div className="skills">
            <span>Figma</span>
            <span>Framer</span>
            <span>Prototyping</span>
            <span>Jitter</span>
            <span>Adobe XD</span>
            <span>Wireframing</span>
            <span>User research</span>
          </div>

          <h4>Experience</h4>
          <p>Internship - UI/UX Design</p>
          <p>Company - Zaalima Development</p>
          <p>2 months</p>
          <p>July - September</p>

        </div>

      </div>

    </div>
  );
}

export default CandidateDetails;