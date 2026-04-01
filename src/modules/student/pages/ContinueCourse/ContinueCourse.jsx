import "./ContinueCourse.css";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

function ContinueCourse() {
  return (

    <div className="course-details">

      {/* Top Bar */}
      <div className="course-topbar">

        <div className="search">
          <FiSearch />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="profile">
          <IoNotificationsOutline />
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="profile"
          />
        </div>

      </div>


      {/* Course Banner */}

      <div className="course-banner">

        <div className="banner-left">

          <span className="tag">Web Development</span>

          <h2>Complete types of variables</h2>

          <p>⭐ 4.6 &nbsp;&nbsp; 12,700 Students &nbsp;&nbsp; ⏱ 1hr 30 min</p>

        </div>

        <div className="banner-right">

          <img
            src="https://img.freepik.com/free-vector/mobile-ui-ux-concept-illustration_114360-1169.jpg"
            alt="course"
          />

        </div>

      </div>


      {/* Lessons */}

      <div className="lesson-list">

        <h3>Course Lessons</h3>

        <div className="lesson">
          <span>Understanding basic of HTML</span>
          <button className="completed">Completed</button>
        </div>

        <div className="lesson">
          <span>How to create forms in HTML</span>
          <button className="completed">Completed</button>
        </div>

        <div className="lesson">
          <span>Types of Variable</span>
          <button className="start">Start</button>
        </div>

        <div className="lesson">
          <span>Number system in Java</span>
          <button className="locked">Locked</button>
        </div>

      </div>

    </div>

  );
}

export default ContinueCourse;