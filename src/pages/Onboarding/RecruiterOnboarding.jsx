import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiImage,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { POST_SIGNUP_EMPLOYER_KEY } from "../../constants/registration";
import "./SharedOnboarding.css";
import "./OnboardingShell.css";
import "./StudentOnboarding.css";
import "./RecruiterOnboarding.css";

/** Steps 7–11 of 12 (after SharedOnboarding → employer path). Goal: start hiring ASAP. */
const STEPS = [
  {
    title: "Company Details",
    subtitle: "Company name, industry, size, and website.",
  },
  {
    title: "Hiring Intent",
    subtitle: "What you're hiring for, roles, skills, and urgency.",
  },
  {
    title: "Create First Job Post",
    subtitle: "Critical — publish a role to activate your pipeline and show value immediately.",
  },
  {
    title: "Company Profile Setup",
    subtitle: "Logo, story, and photos build trust with candidates.",
  },
  {
    title: "Suggested Candidates",
    subtitle: "AI-driven recommendations — invite or shortlist to move fast.",
  },
];

const RECRUITER_STEP_META = [
  { key: "company", label: "Company", Icon: BsBuilding },
  { key: "intent", label: "Intent", Icon: FiTarget },
  { key: "job", label: "Job post", Icon: FiEdit3 },
  { key: "profile", label: "Profile", Icon: FiImage },
  { key: "candidates", label: "Matches", Icon: FiUsers },
];

const ACCENT = "#2e3171";

const INDUSTRY_OPTIONS = [
  "IT & Software",
  "SaaS",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "E-commerce",
  "Manufacturing",
  "Other",
];

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];

const MOCK_CANDIDATES = [
  { id: "c1", name: "Riya Malhotra", sub: "Full-stack · 4 yrs · Bengaluru", initials: "RM" },
  { id: "c2", name: "Arjun Patel", sub: "Backend · Spring · Pune", initials: "AP" },
  { id: "c3", name: "Sneha Iyer", sub: "Product · B2B SaaS · Remote", initials: "SI" },
];

function RecruiterOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
  });

  const [hiringIntent, setHiringIntent] = useState({
    summary: "",
    jobRoles: "",
    skillsNeeded: "",
    immediate: true,
  });

  const [firstJob, setFirstJob] = useState({
    title: "",
    location: "",
    salaryRange: "",
    description: "",
  });

  const [companyProfile, setCompanyProfile] = useState({
    about: "",
  });

  const [shortlisted, setShortlisted] = useState(() => new Set());

  const canShowExtended = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(POST_SIGNUP_EMPLOYER_KEY) === "1";
    } catch {
      return false;
    }
  }, []);

  const nextDisabled = useMemo(() => {
    if (step === 0) {
      return (
        !companyDetails.name.trim() ||
        !companyDetails.industry ||
        !companyDetails.size ||
        !companyDetails.website.trim()
      );
    }
    if (step === 1) {
      return (
        !hiringIntent.summary.trim() ||
        !hiringIntent.jobRoles.trim() ||
        !hiringIntent.skillsNeeded.trim()
      );
    }
    if (step === 2) {
      return (
        !firstJob.title.trim() ||
        !firstJob.location.trim() ||
        !firstJob.salaryRange.trim() ||
        !firstJob.description.trim()
      );
    }
    if (step === 3) {
      return !companyProfile.about.trim();
    }
    return false;
  }, [step, companyDetails, hiringIntent, firstJob, companyProfile]);

  if (!canShowExtended) {
    return <Navigate to="/recruiter" replace />;
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    try {
      sessionStorage.removeItem(POST_SIGNUP_EMPLOYER_KEY);
    } catch {
      /* ignore */
    }
    navigate("/welcome", {
      replace: true,
      state: { next: "/recruiter-dashboard" },
    });
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function toggleShortlist(id) {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const meta = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const currentStepNum = 7 + step;
  const progressPct = (currentStepNum / 12) * 100;
  const StepHeaderIcon = RECRUITER_STEP_META[step].Icon;

  return (
    <div className="shared-onboarding-page">
      <div className="shared-onboarding-inner">
        <header className="shared-onboarding-header">
          <p className="recruiter-onboarding-goal">Goal: Start hiring ASAP</p>
          <div className="shared-onboarding-progress-wrap">
            <div
              className="shared-onboarding-progress-track"
              role="progressbar"
              aria-valuenow={currentStepNum}
              aria-valuemin={1}
              aria-valuemax={12}
            >
              <div
                className="shared-onboarding-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="shared-onboarding-step-label">
              Step {currentStepNum} of 12
            </span>
          </div>

          <div className="shared-onboarding-icons-row">
            {RECRUITER_STEP_META.map((m, i) => {
              const Icon = m.Icon;
              const active = i === step;
              return (
                <div
                  key={m.key}
                  className={`shared-onboarding-icon-item ${
                    active ? "shared-onboarding-icon-item--active" : ""
                  }`}
                >
                  <div
                    className="shared-onboarding-icon-circle"
                    style={
                      active
                        ? { background: ACCENT, borderColor: ACCENT }
                        : undefined
                    }
                  >
                    <Icon aria-hidden className="shared-onboarding-step-ico" />
                  </div>
                  <span className="shared-onboarding-icon-caption">{m.label}</span>
                </div>
              );
            })}
          </div>
        </header>

        <main className="shared-onboarding-card">
          <div className="shared-onboarding-card-head">
            <div
              className="shared-onboarding-card-icon"
              style={{ background: ACCENT }}
            >
              <StepHeaderIcon aria-hidden />
            </div>
            <div>
              <h1 className="shared-onboarding-card-title">{meta.title}</h1>
              <p className="shared-onboarding-card-sub">{meta.subtitle}</p>
            </div>
          </div>

          {step === 0 && (
            <>
              <label className="shared-onboarding-field-label" htmlFor="rec-co-name">
                Company name
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="rec-co-name"
                  type="text"
                  value={companyDetails.name}
                  onChange={(e) =>
                    setCompanyDetails({ ...companyDetails, name: e.target.value })
                  }
                  placeholder="Acme Technologies Pvt Ltd"
                  autoComplete="organization"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-industry">
                Industry
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain recruiter-field-select-wrap">
                <select
                  id="rec-industry"
                  className="recruiter-plain-select"
                  value={companyDetails.industry}
                  onChange={(e) =>
                    setCompanyDetails({
                      ...companyDetails,
                      industry: e.target.value,
                    })
                  }
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-size">
                Company size
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain recruiter-field-select-wrap">
                <select
                  id="rec-size"
                  className="recruiter-plain-select"
                  value={companyDetails.size}
                  onChange={(e) =>
                    setCompanyDetails({ ...companyDetails, size: e.target.value })
                  }
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-web">
                Website
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="rec-web"
                  type="text"
                  inputMode="url"
                  value={companyDetails.website}
                  onChange={(e) =>
                    setCompanyDetails({
                      ...companyDetails,
                      website: e.target.value,
                    })
                  }
                  placeholder="https://"
                  autoComplete="url"
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <label className="shared-onboarding-field-label" htmlFor="rec-hiring-for">
                What are you hiring for?
              </label>
              <textarea
                id="rec-hiring-for"
                className="recruiter-plain-textarea"
                value={hiringIntent.summary}
                onChange={(e) =>
                  setHiringIntent({ ...hiringIntent, summary: e.target.value })
                }
                placeholder="e.g. Mid-level engineers for our payments team, Q2 ramp-up"
              />
              <label className="shared-onboarding-field-label" htmlFor="rec-roles">
                Job roles
              </label>
              <textarea
                id="rec-roles"
                className="recruiter-plain-textarea"
                value={hiringIntent.jobRoles}
                onChange={(e) =>
                  setHiringIntent({ ...hiringIntent, jobRoles: e.target.value })
                }
                placeholder="e.g. Software Engineer, Product Designer"
              />
              <label className="shared-onboarding-field-label" htmlFor="rec-skills">
                Skills needed
              </label>
              <textarea
                id="rec-skills"
                className="recruiter-plain-textarea"
                value={hiringIntent.skillsNeeded}
                onChange={(e) =>
                  setHiringIntent({
                    ...hiringIntent,
                    skillsNeeded: e.target.value,
                  })
                }
                placeholder="e.g. React, Node.js, system design"
              />
              <div className="rec-immediate-block">
                <span className="shared-onboarding-field-label">
                  Immediate hiring?
                </span>
                <div className="rec-yes-no">
                  <button
                    type="button"
                    className={`rec-pill ${hiringIntent.immediate ? "is-on" : ""}`}
                    onClick={() =>
                      setHiringIntent({ ...hiringIntent, immediate: true })
                    }
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`rec-pill ${!hiringIntent.immediate ? "is-on" : ""}`}
                    onClick={() =>
                      setHiringIntent({ ...hiringIntent, immediate: false })
                    }
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="rec-critical-note" role="status">
                This step is key — your first job post activates value for candidates and
                your pipeline immediately.
              </p>
              <label className="shared-onboarding-field-label" htmlFor="rec-j-title">
                Job title
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="rec-j-title"
                  type="text"
                  value={firstJob.title}
                  onChange={(e) =>
                    setFirstJob({ ...firstJob, title: e.target.value })
                  }
                  placeholder="Senior Software Engineer"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-j-loc">
                Location
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="rec-j-loc"
                  type="text"
                  value={firstJob.location}
                  onChange={(e) =>
                    setFirstJob({ ...firstJob, location: e.target.value })
                  }
                  placeholder="Bengaluru / Hybrid / Remote"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-j-sal">
                Salary range
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="rec-j-sal"
                  type="text"
                  value={firstJob.salaryRange}
                  onChange={(e) =>
                    setFirstJob({ ...firstJob, salaryRange: e.target.value })
                  }
                  placeholder="e.g. ₹18–28 LPA"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-j-desc">
                Job description
              </label>
              <textarea
                id="rec-j-desc"
                className="recruiter-plain-textarea"
                value={firstJob.description}
                onChange={(e) =>
                  setFirstJob({ ...firstJob, description: e.target.value })
                }
                placeholder="Responsibilities, requirements, and what success looks like."
              />
            </>
          )}

          {step === 3 && (
            <>
              <label className="shared-onboarding-field-label" htmlFor="rec-logo">
                Logo upload
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain recruiter-file-field">
                <input id="rec-logo" type="file" accept="image/*" />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="rec-about">
                About company
              </label>
              <textarea
                id="rec-about"
                className="recruiter-plain-textarea"
                value={companyProfile.about}
                onChange={(e) =>
                  setCompanyProfile({ ...companyProfile, about: e.target.value })
                }
                placeholder="Mission, culture, and what makes your team great."
              />
              <label className="shared-onboarding-field-label" htmlFor="rec-photos">
                Office photos
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain recruiter-file-field">
                <input
                  id="rec-photos"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="ob-photo-hint rec-suggested-intro">
                AI-driven candidate recommendations based on your job post and hiring
                intent. Invite to apply or shortlist for your pipeline.
              </p>
              {MOCK_CANDIDATES.map((c) => (
                <div key={c.id} className="ob-connection-card">
                  <div className="ob-connection-main">
                    <div className="ob-avatar-sm">{c.initials}</div>
                    <div>
                      <div className="stu-conn-name">{c.name}</div>
                      <div className="stu-conn-sub">{c.sub}</div>
                    </div>
                  </div>
                  <div className="rec-cand-actions">
                    <button type="button" className="stu-conn-btn">
                      Invite
                    </button>
                    <button
                      type="button"
                      className={
                        shortlisted.has(c.id) ? "stu-conn-done" : "rec-shortlist-btn"
                      }
                      onClick={() => toggleShortlist(c.id)}
                    >
                      {shortlisted.has(c.id) ? "Shortlisted" : "Shortlist"}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </main>

        <footer className="shared-onboarding-footer">
          {step > 0 ? (
            <button
              type="button"
              className="shared-onboarding-back"
              onClick={back}
            >
              <FiChevronLeft aria-hidden className="shared-onboarding-back-ico" />
              Back
            </button>
          ) : (
            <span className="shared-onboarding-footer-spacer" />
          )}
          <div className="shared-onboarding-footer-actions">
            {isLast ? (
              <button
                type="button"
                className="shared-onboarding-next shared-onboarding-finish"
                onClick={next}
              >
                Finish
              </button>
            ) : (
              <button
                type="button"
                className="shared-onboarding-next"
                onClick={next}
                disabled={nextDisabled}
              >
                {step === 2 ? "Publish & continue" : "Next"}
                <FiChevronRight aria-hidden />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default RecruiterOnboarding;
