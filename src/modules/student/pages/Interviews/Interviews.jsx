import "./Interviews.css";
import { useEffect, useState } from "react";
import { FiSearch, FiBell, FiX } from "react-icons/fi";

const DEFAULT_INTERVIEWS = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    round: "Aptitude",
    roundLabel: "Round 1",
    company: "Expedia",
    date: "Feb 18, 2026",
    time: "10:00 am",
    interviewers: [
      { initial: "R", bg: "#ea580c" },
      { initial: "R", bg: "#ca8a04" },
    ],
  },
];

function Interviews() {
  const [interviews] = useState(DEFAULT_INTERVIEWS);
  const [activeInterview, setActiveInterview] = useState(null);

  function openModal(item) {
    setActiveInterview(item);
  }

  function closeModal() {
    setActiveInterview(null);
  }

  useEffect(() => {
    if (!activeInterview) return undefined;
    function onKey(e) {
      if (e.key === "Escape") setActiveInterview(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeInterview]);

  return (
    <div className="interviews-page">
      <div className="topbar">
        <div />
        <div className="topbar-right">
          <div className="search-box">
            <FiSearch />
            <input placeholder="Search..." />
          </div>
          <FiBell className="bell" />
        </div>
      </div>

      <div className="title-section">
        <h2>Interview Pipeline</h2>
        <p>{interviews.length} Shortlisted</p>
      </div>

      {interviews.map((item) => (
        <div key={item.id} className="pipeline-card">
          <div className="left-section">
            <div className="green-line" aria-hidden />
            <div>
              <h3>{item.role}</h3>
              <p>Round: {item.round}</p>
              <span>{item.date}</span>
            </div>
          </div>

          <div className="right-section">
            <button
              type="button"
              className="join-interview-btn"
              onClick={() => openModal(item)}
            >
              Join Interview
            </button>
          </div>
        </div>
      ))}

      {activeInterview ? (
        <div
          className="interview-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="interview-modal-title"
          onClick={closeModal}
        >
          <div
            className="interview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="interview-modal-header">
              <h3 id="interview-modal-title">{activeInterview.role}</h3>
              <button
                type="button"
                className="interview-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="interview-modal-body">
              <div className="interview-modal-row">
                <span className="interview-modal-label">Company</span>
                <span className="interview-modal-value">
                  {activeInterview.company}
                </span>
              </div>
              <div className="interview-modal-row">
                <span className="interview-modal-label">
                  {activeInterview.roundLabel}
                </span>
                <span className="interview-modal-value">
                  {activeInterview.round}
                </span>
              </div>
              <div className="interview-modal-row">
                <span className="interview-modal-label">Date</span>
                <span className="interview-modal-value">
                  {activeInterview.date}
                </span>
              </div>
              <div className="interview-modal-row interview-modal-row--time">
                <span className="interview-modal-label">Time</span>
                <div className="interview-modal-time-right">
                  <span className="interview-modal-value">
                    {activeInterview.time}
                  </span>
                  <div
                    className="interviewer-stack"
                    aria-label="Interviewers"
                  >
                    {activeInterview.interviewers?.map((p, i) => (
                      <span
                        key={i}
                        className="interviewer-avatar"
                        style={{
                          background: p.bg,
                          zIndex: i + 1,
                        }}
                        aria-hidden
                      >
                        {p.initial}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="interview-modal-join-room">
              Join Interview Room
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Interviews;
