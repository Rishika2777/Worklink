import "./ProfileResume.css";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiDownload,
  FiEye,
  FiBriefcase,
  FiEdit2
} from "react-icons/fi";

import robot from "../../../../assets/images/robot-login.png";
import cert1 from "../../../../assets/images/course1.jpg";
import cert2 from "../../../../assets/images/course3.jpg";

function ProfileResume() {
  return (
    <div className="profile-resume">

      {/* PROFILE CARD */}

      <div className="profile-card">

        <div className="profile-avatar">
          <img src={robot} alt="profile" />
          <span className="progress">100%</span>
        </div>

        <div className="profile-content">

          <div className="profile-name">
            <h2>Henrietta Mitchell</h2>
            <FiEdit2 className="edit-icon" />
          </div>

          <p className="update">
            Profile last updated - 29 Dec 2025
          </p>

          <div className="profile-info">

            <div className="info-item">
              <FiMapPin />
              <span>Indore, India</span>
            </div>

            <div className="info-item">
              <FiBriefcase />
              <span>Fresher</span>
            </div>

            <div className="info-item">
              <FiPhone />
              <span>+9165****8790</span>
            </div>

            <div className="info-item">
              <FiMail />
              <span>Henrietta88@gmail.com</span>
            </div>

          </div>

        </div>

      </div>


      {/* RESUME SECTION */}

      <div className="resume-card">

        <img src={robot} className="robot" alt="robot" />

        <div className="resume-details">

          <h4>Resume</h4>

          <p>Uresume.pdf</p>

          <span className="date">
            Uploaded on Dec 29, 2025
          </span>

          <div className="resume-icons">

            <button>
              <FiDownload />
            </button>

            <button>
              🗑
            </button>

          </div>

          <button className="update-btn">
            Update Resume
          </button>

          <p className="formats">
            Supported formats : doc, docx, pdf. upto 2 MB
          </p>

        </div>

      </div>


      {/* RESUME HEADLINE */}

      <div className="headline-card">

        <h4>Resume Headline</h4>

        <p>
          I am passionate about UI/UX designing and love to solve user problems.
        </p>

      </div>


      {/* SKILLS */}

      <div className="skills-card">

        <h4>Key Skills</h4>

        <div className="skills">

          <span>Figma</span>
          <span>UI/UX</span>
          <span>Prototyping</span>
          <span>Wireframing</span>
          <span>Adobe XD</span>

        </div>

      </div>


      {/* CERTIFICATES */}

      <div className="cert-section">

        <h4>My Certificates</h4>

        <div className="cert-grid">

          <div className="cert-card">

            <img src={cert1} alt="certificate" />

            <h5>Graphic Designing</h5>

            <p>Joe National</p>

            <span>Completed on Dec 15, 2025</span>

            <div className="cert-actions">

              <button>
                <FiEye /> View
              </button>

              <button>
                <FiDownload /> Download
              </button>

            </div>

          </div>


          <div className="cert-card">

            <img src={cert2} alt="certificate" />

            <h5>Ethical Hacking</h5>

            <p>IT Security online Training</p>

            <span>Completed on Dec 6, 2025</span>

            <div className="cert-actions">

              <button>
                <FiEye /> View
              </button>

              <button>
                <FiDownload /> Download
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfileResume;