import "./ResumeModal.css";
import { FiX, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

function ResumeModal({ close }) {

  return (

    <div className="resume-overlay">

      <div className="resume-modal">

        <button className="close-btn" onClick={close}>
          <FiX />
        </button>

        <div className="resume-container">

          {/* LEFT */}

          <div className="resume-left">

            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              className="resume-avatar"
            />

            <h3>Contact</h3>

            <p><FiPhone/> 6268*****16</p>
            <p><FiMail/> rimeemodi87@gmail.com</p>
            <p><FiMapPin/> Bhopal, M.P</p>

            <hr/>

            <h3>Education</h3>

            <p>Medi-Caps University</p>
            <p>Indore,M.P</p>
            <p>Masters in Computer Application</p>
            <p>2024-2026</p>

          </div>


          {/* RIGHT */}

          <div className="resume-right">

            <h1>Rimee Modi</h1>

            <h3 className="role">UI/UX Designer</h3>

            <p className="summary">
              I bring an engineering perspective and creative problem solving
              approach to create products and crafting experiences people
              use to love.
            </p>

            <p className="quote">
              “Design is thinking made visual”
            </p>


            <h3>Skills</h3>

            <div className="skills">

              <span>Figma</span>
              <span>Framer</span>
              <span>Prototyping</span>
              <span>Jitter</span>
              <span>Abode XD</span>
              <span>Wireframing</span>
              <span>User research</span>

            </div>


            <h3>Experience</h3>

            <p>Internship - UI/UX Design</p>
            <p>Company - Zaalima Development</p>
            <p>2 months</p>
            <p>July - September</p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default ResumeModal;