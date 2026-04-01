import { NavLink, useLocation } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiUser,
  FiLogOut,
  FiBookOpen,
  FiBarChart2,
  FiClipboard,
  FiGrid,FiHelpCircle, FiVideo, FiLayers
} from "react-icons/fi";

import "./sidebar.css";
import robot from "../../assets/images/robot-login.png";

function Sidebar() {

  const location = useLocation();

  const isRecruiter = location.pathname.startsWith("/recruiter-dashboard");
  const isInstitute = location.pathname.startsWith("/institute-dashboard");
  const isStudent = location.pathname.startsWith("/student-dashboard");
  const isAdmin = location.pathname.startsWith("/admin-dashboard");

  return (
    <div className="sidebar">

      <h2 className="logo">WorkLink</h2>

      <ul className="menu">

        {/* ---------------- RECRUITER MENU ---------------- */}

        {isRecruiter && (
          <>
            <li>
              <NavLink to="/recruiter-dashboard/job-posting">
                <FiBriefcase className="icon"/>
                Job Posting
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/candidates">
                <FiUsers className="icon"/>
                Candidates
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/interview">
                <FiClock className="icon"/>
                Interview Schedule
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/shortlisted">
                <FiCheckCircle className="icon"/>
                Shortlisted
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/profile">
                <FiUser className="icon"/>
                Profile
              </NavLink>
            </li>
          </>
        )}


        {/* ---------------- INSTITUTE MENU ---------------- */}

        {isInstitute && (
          <>
            <li>
              <NavLink to="/institute-dashboard/course-management">
                <FiBookOpen className="icon"/>
                Course Management
              </NavLink>
            </li>

            <li>
              <NavLink to="/institute-dashboard/student-enrollment">
                <FiUsers className="icon"/>
                Student Enrollment
              </NavLink>
            </li>

            <li>
              <NavLink to="/institute-dashboard/assessment">
                <FiClipboard className="icon"/>
                Assessment
              </NavLink>
            </li>

            <li>
              <NavLink to="/institute-dashboard/analytics">
                <FiBarChart2 className="icon"/>
                Analytics
              </NavLink>
            </li>
          </>
        )}


      {/* ---------------- STUDENT MENU ---------------- */}

{isStudent && (
  <>
    <li>
      <NavLink to="/student-dashboard" end>
        <FiGrid className="icon"/>
        Dashboard
      </NavLink>
    </li>

    <li>
      <NavLink to="/student-dashboard/my-courses">
        <FiBookOpen className="icon"/>
        My Courses
      </NavLink>
    </li>

    <li>
      <NavLink to="/student-dashboard/assessment">
        <FiClipboard className="icon"/>
        Assessment
      </NavLink>
    </li>

    <li>
      <NavLink to="/student-dashboard/jobs">
        <FiBriefcase className="icon"/>
        Job Matches
      </NavLink>
    </li>

 <li>
      <NavLink to="/student-dashboard/interviews">
        <FiVideo className="icon"/>
        Interviews
      </NavLink>
    </li>

    <li>
      <NavLink to="/student-dashboard/profile">
        <FiUser className="icon"/>
        Profile & Resume
      </NavLink>
    </li>

<li>
<NavLink to="/student-dashboard/help">
<FiHelpCircle className="icon"/>
Need Help?
</NavLink>
</li>
  </>
)}

      {/* ---------------- ADMIN MENU ---------------- */}

{isAdmin && (
  <>
    <li>
      <NavLink to="/admin-dashboard" end>
        <FiGrid className="icon"/>
        Dashboard
      </NavLink>
    </li>

    <li>
      <NavLink to="/admin-dashboard/aspirants">
        <FiUsers className="icon"/>
        Students
      </NavLink>
    </li>

    <li>
      <NavLink to="/admin-dashboard/employees">
        <FiUser className="icon"/>
        Employees
      </NavLink>
    </li>

    <li>
      <NavLink to="/admin-dashboard/training">
        <FiLayers className="icon"/>
        Training
      </NavLink>
    </li>
  </>
)}

      </ul>


      {/* ROBOT IMAGE */}

      <div className="sidebar-robot">
        <img src={robot} alt="robot" />
      </div>


      {/* LOGOUT */}

      <div className="logout">
        <FiLogOut className="icon"/>
        Log Out
      </div>

    </div>
  );
}

export default Sidebar;