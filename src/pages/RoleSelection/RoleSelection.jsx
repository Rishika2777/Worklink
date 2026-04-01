import React from "react";
import { useNavigate } from "react-router-dom";
import "./roleSelection.css";
import {
  POST_SIGNUP_COMPLETE_KEY,
  POST_SIGNUP_EMPLOYER_KEY,
  POST_SIGNUP_INSTITUTE_KEY,
} from "../../constants/registration";
import robot from "../../assets/images/robot-login.png";
import bg from "../../assets/images/background.jpeg";

function RoleSelection() {
  const navigate = useNavigate();
  return (
    <div
      className="role-page"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="role-container">

        <div className="role-robot">
          <img src={robot} alt="robot" />
        </div>

        <h2 className="role-title">
          How Would you Like to Join?
        </h2>

  <div className="role-buttons">

<button
className="role-btn"
onClick={() => {
  try {
    if (sessionStorage.getItem(POST_SIGNUP_EMPLOYER_KEY) === "1") {
      navigate("/onboarding/recruiter");
      return;
    }
  } catch {
    /* ignore */
  }
  navigate("/recruiter");
}}
>
Employee / Recruiter
</button>

<button
className="role-btn"
onClick={() => {
  try {
    if (sessionStorage.getItem(POST_SIGNUP_COMPLETE_KEY) === "1") {
      navigate("/onboarding/student");
      return;
    }
  } catch {
    /* ignore */
  }
  navigate("/student");
}}
>
Aspirants
</button>

<button
className="role-btn"
onClick={() => {
  try {
    if (sessionStorage.getItem(POST_SIGNUP_INSTITUTE_KEY) === "1") {
      navigate("/onboarding/institute");
      return;
    }
  } catch {
    /* ignore */
  }
  navigate("/institute");
}}
>
Training Institute
</button>

<button
className="role-btn"
onClick={()=>navigate("/admin")}
>
Admin
</button>

</div>

      </div>
    </div>
  );
}

export default RoleSelection;