import "./Shortlisted.css";
import { useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiMessageCircle,
  FiPause,
  FiStar,
  FiThumbsUp,
} from "react-icons/fi";

const STATUS_OPTIONS = [
  { value: "hold", label: "Hold" },
  { value: "hire", label: "Hire" },
  { value: "reject", label: "Reject" },
];

const SAMPLE = {
  name: "Ritu Jain",
  initials: "RJ",
  role: "Senior Frontend Developer",
  scoreCurrent: 92,
  scoreMax: 100,
  comment:
    "Excellent problem-solving skills, strong React Knowledge.",
};

function Shortlisted() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("hold");
  const menuRef = useRef(null);

  const currentLabel =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "Hold";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectStatus(value) {
    setStatus(value);
    setMenuOpen(false);
  }

  return (
    <div className="shortlisted-mock">
      <div className="shortlisted-mock-inner">
        <section className="shortlisted-stats" aria-label="Shortlist summary">
          <article className="shortlisted-stat-card">
            <span className="shortlisted-stat-icon shortlisted-stat-icon--hire" aria-hidden>
              <FiCheck strokeWidth={2.5} />
            </span>
            <div className="shortlisted-stat-body">
              <span className="shortlisted-stat-num">0</span>
              <span className="shortlisted-stat-label">To Hire</span>
            </div>
          </article>
          <article className="shortlisted-stat-card">
            <span className="shortlisted-stat-icon shortlisted-stat-icon--hold" aria-hidden>
              <FiPause strokeWidth={2.5} />
            </span>
            <div className="shortlisted-stat-body">
              <span className="shortlisted-stat-num">1</span>
              <span className="shortlisted-stat-label">On Hold</span>
            </div>
          </article>
          <article className="shortlisted-stat-card">
            <span className="shortlisted-stat-icon shortlisted-stat-icon--score" aria-hidden>
              <FiStar strokeWidth={2} />
            </span>
            <div className="shortlisted-stat-body">
              <span className="shortlisted-stat-num">0</span>
              <span className="shortlisted-stat-label">Average Score</span>
            </div>
          </article>
        </section>

        <article className="shortlisted-person-card">
          <div className="shortlisted-person-top">
            <div className="shortlisted-person-main">
              <div className="shortlisted-avatar-initials" aria-hidden>
                {SAMPLE.initials}
              </div>
              <div className="shortlisted-person-text">
                <h2 className="shortlisted-person-name">{SAMPLE.name}</h2>
                <p className="shortlisted-person-role">{SAMPLE.role}</p>
                <p className="shortlisted-person-score">
                  <FiThumbsUp className="shortlisted-score-ico" aria-hidden />
                  <span>
                    Score: {SAMPLE.scoreCurrent}/{SAMPLE.scoreMax}
                  </span>
                </p>
              </div>
            </div>

            <div className="shortlisted-action-wrap" ref={menuRef}>
              <button
                type="button"
                className="shortlisted-action-trigger"
                aria-expanded={menuOpen}
                aria-haspopup="listbox"
                onClick={() => setMenuOpen((o) => !o)}
              >
                {currentLabel}
                <FiChevronDown
                  className={`shortlisted-chevron ${menuOpen ? "is-open" : ""}`}
                  aria-hidden
                />
              </button>
              {menuOpen ? (
                <ul className="shortlisted-action-menu" role="listbox">
                  {STATUS_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={status === opt.value}
                        className={`shortlisted-action-item ${
                          status === opt.value ? "is-active" : ""
                        }`}
                        onClick={() => selectStatus(opt.value)}
                      >
                        {status === opt.value ? (
                          <FiCheck className="shortlisted-action-check" aria-hidden />
                        ) : (
                          <span className="shortlisted-action-check-placeholder" aria-hidden />
                        )}
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="shortlisted-comment">
            <FiMessageCircle className="shortlisted-comment-ico" aria-hidden />
            <p className="shortlisted-comment-text">{SAMPLE.comment}</p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default Shortlisted;
