import "./Candidates.css";
import { useState } from "react";
import { FiSearch, FiEye, FiUserPlus, FiUserX } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import CandidateDetails from "../CandidateDetails/CandidateDetails";

function Candidates() {

  const [search, setSearch] = useState("");
const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return <CandidateDetails onBack={() => setShowDetails(false)} />;
  }

  return (

    <div className="candidates-container">

      {/* HEADER */}

    {/* HEADER */}

<div className="candidate-header">

  <div className="header-right">

    <div className="search-box">
      <FiSearch className="search-icon"/>
      <input
        type="text"
        placeholder="Search by skills....."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />
    </div>

    <div className="notification-icon">
      <IoNotificationsOutline/>
      <span className="notify-dot"></span>
    </div>

  </div>

</div>


      {/* CANDIDATE CARD */}

      <div className="candidate-card">

        <div className="candidate-left">

          <div className="avatar">
            RJ
          </div>

          <div className="candidate-info">

            <h3>Ritu Jain</h3>

            <p className="email">
              ritujain80@gmail.com
            </p>

            <p className="education">
              B.SC. Computer Science, MIT
            </p>

            <p className="role">
              Senior Frontend Developer
            </p>

            <div className="candidate-skills">
              <span>React</span>
              <span>Type Script</span>
              <span>Node.js</span>
            </div>


        <div className="candidate-buttons">

 <button
  className="view-btn"
  onClick={() => setShowDetails(true)}
>
  <FiEye />
  View
</button>

  <button className="shortlist-btn">
    <FiUserPlus />
    Shortlist
  </button>

  <button className="reject-btn">
    <FiUserX />
  </button>

</div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Candidates;