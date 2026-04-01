import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="admin-home-page">
      <div className="admin-home-glow admin-home-glow-left" />
      <div className="admin-home-glow admin-home-glow-right" />

      <div className="admin-home-card">
        <span className="admin-badge">WorkLink Admin Suite</span>

        <div className="admin-home-actions">
          <button
            className="admin-primary-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Open Admin Panel
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
