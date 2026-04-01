import { useState } from "react";
import "./CreateJob.css";
import { createRecruiterJob } from "../../api/recruiterJobs";

function parseJobApiError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    const low = d.toLowerCase();
    if (low.includes("err_ngrok_3200") || low.includes("is offline")) {
      return "API tunnel is offline. Check your backend and proxy.";
    }
    return d.length > 400 ? "Unexpected server response." : d;
  }
  if (d?.path && d?.status === 404) {
    return `Job API not found (${d.path}). Set VITE_RECRUITER_JOBS_API_PATH in .env to match your Swagger (e.g. /api/v1/company/jobs).`;
  }
  return (
    d?.message ||
    d?.error ||
    (Array.isArray(d?.errors) && d.errors.join(", ")) ||
    err.message ||
    "Could not post job."
  );
}

function CreateJob({ closeForm, refreshJobs }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    experienceLevel: "",
    employmentType: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const isStepOneValid =
    form.title.trim() !== "" &&
    form.description.trim() !== "" &&
    form.skills.trim() !== "";

  const isStepTwoValid =
    form.experienceLevel &&
    form.employmentType &&
    form.location &&
    form.salaryMin &&
    form.salaryMax;

  const handleSubmit = async () => {
    setApiError("");
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      requiredSkills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      experienceLevel: form.experienceLevel,
      employmentType: form.employmentType,
      location: form.location.trim(),
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
    };

    setSubmitting(true);
    try {
      await createRecruiterJob(payload);
      if (typeof refreshJobs === "function") {
        await refreshJobs();
      }
      closeForm();
    } catch (error) {
      console.error("POST job error:", error.response?.data || error.message);
      setApiError(parseJobApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Job Posting</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeForm}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {apiError ? (
          <p className="create-job-api-error" role="alert">
            {apiError}
          </p>
        ) : null}

        {step === 1 && (
          <div className="form-step">
            <label htmlFor="cj-title">Job Title</label>
            <input
              id="cj-title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            <label htmlFor="cj-desc">Job Description</label>
            <textarea
              id="cj-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <label htmlFor="cj-skills">Required Skills (comma separated)</label>
            <input
              id="cj-skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node, AWS"
            />

            <div className="form-actions">
              <button
                type="button"
                disabled={!isStepOneValid}
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <label htmlFor="cj-exp">Experience Level</label>
            <select
              id="cj-exp"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID_LEVEL">Mid</option>
              <option value="SENIOR">Senior</option>
            </select>

            <label htmlFor="cj-emp">Employment Type</label>
            <select
              id="cj-emp"
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>

            <label htmlFor="cj-loc">Location</label>
            <input
              id="cj-loc"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Indore"
            />

            <label>Salary (per month)</label>
            <div className="salary-range">
              <input
                name="salaryMin"
                value={form.salaryMin}
                onChange={handleChange}
                placeholder="Min"
                inputMode="numeric"
              />
              <span>to</span>
              <input
                name="salaryMax"
                value={form.salaryMax}
                onChange={handleChange}
                placeholder="Max"
                inputMode="numeric"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setStep(1)}>
                Back
              </button>

              <button
                type="button"
                disabled={!isStepTwoValid || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Posting…" : "Post a Job"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateJob;
