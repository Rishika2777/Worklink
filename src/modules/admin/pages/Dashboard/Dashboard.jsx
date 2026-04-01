import { FiBell, FiBookOpen, FiSearch, FiUsers } from "react-icons/fi";
import { MdOutlineSchool, MdOutlineTrendingUp } from "react-icons/md";
import "../../styles/AdminPanel.css";

function Dashboard() {
  return (
    <div className="admin-panel">
      <div className="admin-topbar">
        <div className="admin-search">
          <FiSearch />
          <input placeholder="Search..." />
        </div>
        <div className="admin-bell">
          <FiBell />
          <span className="admin-bell-dot" />
        </div>
      </div>

      <div className="admin-section-head">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your training & staffing platform</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div>
            <p className="admin-stat-label">Total Students</p>
            <h3 className="admin-stat-value">1,600</h3>
            <p className="admin-stat-sub">+9.3% from last month</p>
          </div>
          <span className="admin-stat-icon"><FiUsers /></span>
        </div>
        <div className="admin-stat-card">
          <div>
            <p className="admin-stat-label">Active Employees</p>
            <h3 className="admin-stat-value">10</h3>
            <p className="admin-stat-sub">+3 this week</p>
          </div>
          <span className="admin-stat-icon"><MdOutlineSchool /></span>
        </div>
        <div className="admin-stat-card">
          <div>
            <p className="admin-stat-label">Active Training</p>
            <h3 className="admin-stat-value">30</h3>
            <p className="admin-stat-sub">6 starting this week</p>
          </div>
          <span className="admin-stat-icon"><FiBookOpen /></span>
        </div>
        <div className="admin-stat-card">
          <div>
            <p className="admin-stat-label">Completion Rate</p>
            <h3 className="admin-stat-value">70.6%</h3>
            <p className="admin-stat-sub">+2.1% improvement</p>
          </div>
          <span className="admin-stat-icon"><MdOutlineTrendingUp /></span>
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-panel-head">
          <h3>Recent Activity</h3>
          <p className="admin-activity-sub">Last 24 hours</p>
        </div>
        <div className="admin-activity-list">
          <div className="admin-activity-item">
            <div>
              <p className="admin-activity-title">New Student enrolled</p>
              <p className="admin-activity-sub">Priya sharma . Students</p>
            </div>
            <p className="admin-activity-sub">2 min ago</p>
          </div>
          <div className="admin-activity-item">
            <div>
              <p className="admin-activity-title">Training completed</p>
              <p className="admin-activity-sub">React Advanced . Training</p>
            </div>
            <p className="admin-activity-sub">15 min ago</p>
          </div>
          <div className="admin-activity-item">
            <div>
              <p className="admin-activity-title">Employee Onboarded</p>
              <p className="admin-activity-sub">Rahul Verma . Employees</p>
            </div>
            <p className="admin-activity-sub">1 hr ago</p>
          </div>
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-panel-head">
          <h3>Upcoming Training</h3>
          <p className="admin-stat-sub">View all</p>
        </div>

        <div className="admin-upcoming-item">
          <div className="admin-activity-item">
            <p className="admin-activity-title">Cloud Architecture</p>
            <p className="admin-activity-sub">Mar 24</p>
          </div>
          <p className="admin-activity-sub">12/20 enrolled</p>
          <div className="admin-progress-track">
            <div className="admin-progress-fill" style={{ width: "70%" }} />
          </div>
        </div>

        <div className="admin-upcoming-item">
          <div className="admin-activity-item">
            <p className="admin-activity-title">Project Management</p>
            <p className="admin-activity-sub">Mar 28</p>
          </div>
          <p className="admin-activity-sub">15/25 enrolled</p>
          <div className="admin-progress-track">
            <div className="admin-progress-fill" style={{ width: "75%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
