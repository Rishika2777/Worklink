import "./Dashboard.css";
import { FiBell, FiSearch, FiBookOpen, FiAward, FiBriefcase } from "react-icons/fi";

function Dashboard() {

  return (

    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div className="search-box">
          <FiSearch />
          <input placeholder="Search courses, jobs...."/>
        </div>

        <FiBell className="bell"/>

      </div>


      {/* WELCOME */}

      <div className="welcome-row">

        <div>
          <p className="hi-text">Hi Rimee Modi!</p>
          <h2 className="welcome-title">
            Welcome Back 👋
          </h2>
        </div>

        <select className="week-select">
          <option>This Week</option>
        </select>

      </div>



      {/* ACTIVITY + CALENDAR */}

      <div className="top-section">

        {/* ACTIVITY */}

        <div className="activity-card">

          <h4>Activity</h4>
          <p>30 hrs, 50 min on this week</p>

          <div className="bars">

            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <div className="bar bar4"></div>
            <div className="bar bar5"></div>
            <div className="bar bar6"></div>
            <div className="bar bar7"></div>

          </div>

          <div className="days">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

        </div>


        {/* CALENDAR */}

        <div className="calendar">

          <h4>December 2025</h4>

          <div className="calendar-grid">

            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>

            {[...Array(31)].map((_,i)=>(
              <div
                key={i}
                className={`date ${i+1===23 ? "active":""}`}
              >
                {i+1}
              </div>
            ))}

          </div>

        </div>

      </div>



      {/* STATS */}

      <div className="stats">

        <div className="card blue">

          <div className="card-icon">
            <FiBookOpen/>
          </div>

          <p>Enrolled Courses</p>

          <h3>6</h3>

        </div>


        <div className="card purple">

          <div className="card-icon">
            <FiAward/>
          </div>

          <p>Certificates</p>

          <h3>2</h3>

        </div>


        <div className="card green">

          <div className="card-icon">
            <FiBriefcase/>
          </div>

          <p>Applied Jobs</p>

          <h3>1</h3>

        </div>

      </div>

    </div>

  )

}

export default Dashboard;