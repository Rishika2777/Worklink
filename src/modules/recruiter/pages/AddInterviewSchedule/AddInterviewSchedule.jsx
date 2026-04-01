import "./AddInterviewSchedule.css";
import { IoClose } from "react-icons/io5";

function AddInterviewSchedule({ close }) {
  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">
          <h2>Schedule Interview</h2>
          <IoClose className="close-icon" onClick={close} />
        </div>

        <div className="modal-body">

          <div className="form-group">
            <label>Candidate Name</label>
            <input placeholder="Select candidate" />
          </div>

          <div className="form-group">
            <label>Job Role</label>
            <input placeholder="Position" />
          </div>

          <div className="form-group">
            <label>Interviewer</label>
            <input placeholder="Interviewer name" />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Mode</label>
              <select>
                <option>Select</option>
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>

            <div className="form-group">
              <label>Meeting Link</label>
              <input placeholder="URL" />
            </div>
          </div>

          <button className="schedule-btn-modal">
            Schedule
          </button>

        </div>
      </div>
    </div>
  );
}

export default AddInterviewSchedule;