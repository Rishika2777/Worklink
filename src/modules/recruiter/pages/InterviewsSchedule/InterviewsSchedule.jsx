import "./InterviewsSchedule.css";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import ResumeModal from "../../components/Resume/ResumeModal";
import { IoNotificationsOutline } from "react-icons/io5";
import ScheduleInterviewModal from "../../pages/AddInterviewSchedule/AddInterviewSchedule";

function InterviewsSchedule() {

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showResume, setShowResume] = useState(false);
const [statusFilter, setStatusFilter] = useState("All Status");
  return (
    <div className="interview-container">

      {/* HEADER */}
{/* HEADER */}

<div className="interview-header">

  <div></div>

  <div className="header-actions">

   <button
  className="schedule-btn"
  onClick={() => setShowScheduleModal(true)}
>
  + Schedule Interview
</button>

    <div className="notification-icon">
      <IoNotificationsOutline />
      <span className="notify-dot"></span>
    </div>

  </div>

</div>


      {/* TOP SECTION */}

      <div className="top-section">

        {/* STATS */}

        <div className="stats">

          <div className="stat-box">
            <p className="stat-number">1</p>
            <p className="stat-label">Upcoming</p>
          </div>

          <div className="stat-box">
            <p className="stat-number">0</p>
            <p className="stat-label">Completed</p>
          </div>

          <div className="stat-box">
            <p className="stat-number">1</p>
            <p className="stat-label">Online</p>
          </div>

        </div>

       

      </div>


   {/* FILTER */}

<div className="filter-row">

  <select
    className="status-filter"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option>All Status</option>
    <option>Scheduled</option>
    <option>Completed</option>
    <option>Cancelled</option>
  </select>

</div>


{/* INTERVIEW LIST */}

<div className="interview-list">

        <div className="interview-item">

          <div className="interview-left">

            <h4>Ritu Jain</h4>
            <p>Senior Frontend Developer</p>

            <div className="meta">
              <span>Sarah HR</span>
              <span>2026-02-18</span>
              <span>10:00 AM</span>
              <span className="online">Online</span>
            </div>

          </div>

          <button className="join-btn">
            Join Meeting
          </button>

        </div>

      </div>
{/* SCHEDULE INTERVIEW MODAL */}

{showScheduleModal && (
  <ScheduleInterviewModal
    close={() => setShowScheduleModal(false)}
  />
)}

      {/* RESUME MODAL */}

      {showResume && (
        <ResumeModal close={() => setShowResume(false)} />
      )}

    </div>
  );
}

export default InterviewsSchedule;