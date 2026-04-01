import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="institute-dashboard">

      <h2>Welcome Training Institute</h2>

      <p>
        Manage courses, track student progress and monitor performance
        from one centralized dashboard.
      </p>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Courses</h3>
          <p>12 Active Courses</p>
        </div>

        <div className="card">
          <h3>Students</h3>
          <p>340 Enrolled Students</p>
        </div>

        <div className="card">
          <h3>Assessments</h3>
          <p>28 Tests Conducted</p>
        </div>

        <div className="card">
          <h3>Placements</h3>
          <p>45 Students Placed</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;