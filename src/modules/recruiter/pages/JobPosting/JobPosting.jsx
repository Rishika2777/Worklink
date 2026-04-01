import "./JobPosting.css";
import { useCallback, useEffect, useState } from "react";
import CreateJob from "../CreateJob/CreateJob";
import { FiSearch } from "react-icons/fi";
import {
  getRecruiterJobs,
  normalizeJobsList,
} from "../../api/recruiterJobs";

function parseListError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    return d.length > 400 ? "Could not load jobs." : d;
  }
  if (d?.path && d?.status === 404) {
    return `Job API not found (${d.path}). Set VITE_RECRUITER_JOBS_API_PATH to your Swagger path or add the route on the server.`;
  }
  return d?.message || err.message || "Could not load jobs.";
}

function JobPosting() {
  const [status, setStatus] = useState("ALL");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const { data } = await getRecruiterJobs(
        status !== "ALL" ? { status } : {}
      );
      setJobs(normalizeJobsList(data));
    } catch (error) {
      console.error("GET jobs error:", error);
      setListError(parseListError(error));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="job-container">
      <div className="job-header">
        <div className="search-box">
          <FiSearch />
          <input type="text" placeholder="Search jobs..." />
        </div>

        <div className="job-actions">
          <button
            type="button"
            className="post-btn"
            onClick={() => setShowForm(true)}
          >
            + Post New Job
          </button>

          <select
            className="filter-dropdown"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ALL">All Jobs</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {listError ? (
        <p className="job-list-error" role="alert">
          {listError}
        </p>
      ) : null}

      <div className="job-list">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 && !listError ? (
          <p className="job-list-empty">No jobs yet. Post one with &quot;+ Post New Job&quot;.</p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job.id ?? job.title}>
              <div className="job-left">
                <div className="job-title">{job.title}</div>

                <div className="job-meta">
                  {job.location} • {job.employmentType} • Posted{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "—"}
                </div>

                <div className="job-skills">
                  {job.requiredSkills?.map((skill, i) => (
                    <span key={i}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="job-right">
                <div className="applicant-count">
                  {job.applicantCount || 0}
                  <span>Applicants</span>
                </div>

                <div className="status">{job.status}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm ? (
        <CreateJob
          closeForm={() => setShowForm(false)}
          refreshJobs={fetchJobs}
        />
      ) : null}
    </div>
  );
}

export default JobPosting;
