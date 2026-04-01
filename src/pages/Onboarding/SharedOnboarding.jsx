import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiGlobe,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiUserPlus,
  FiUsers,
  FiClipboard,
  FiPlus,
  FiUser,
  FiBook,
  FiCamera,
  FiBell,
  FiMail,
  FiTrendingUp,
  FiRss,
  FiAward,
  FiFileText,
} from "react-icons/fi";
import { FaGraduationCap, FaBullseye } from "react-icons/fa";
import { BsBuilding } from "react-icons/bs";
import { NINE_STEP_META } from "./sharedOnboardingSteps";
import {
  POST_SIGNUP_COMPLETE_KEY,
  POST_SIGNUP_EMPLOYER_KEY,
  POST_SIGNUP_INSTITUTE_KEY,
} from "../../constants/registration";
import "./SharedOnboarding.css";

const COMMON_STORAGE_KEY = "worklink_onboarding_common";

const SUGGESTED_SKILL_TAGS = [
  "JavaScript",
  "React",
  "Figma",
  "Python",
  "Marketing",
  "Flutter",
  "Spring Boot",
  "Node.js",
];

const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Marketing",
  "Finance",
  "Education",
  "Consulting",
];

const CONNECT_SUGGESTIONS = [
  {
    id: "1",
    initials: "SC",
    name: "Sara Chean",
    sub: "Product manager at Google",
  },
  {
    id: "2",
    initials: "TJ",
    name: "Tanvi Jain",
    sub: "UI/UX Designer at TCS",
  },
];

const FEED_COMPANIES = [
  { id: "google", name: "Google", followers: "28M" },
  { id: "microsoft", name: "Microsoft", followers: "22M" },
  { id: "apple", name: "Apple", followers: "18M" },
  { id: "amazon", name: "Amazon", followers: "15M" },
  { id: "tesla", name: "Tesla", followers: "12M" },
  { id: "netflix", name: "Netflix", followers: "10M" },
];

const FEED_TOPICS = [
  "Artificial Intelligence",
  "Startups",
  "Leadership",
  "Remote Work",
  "Career Growth",
  "Web Development",
  "Entrepreneurship",
];

function SharedOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [location, setLocation] = useState({ country: "", city: "" });
  const [identity, setIdentity] = useState({
    jobTitle: "",
    company: "",
    status: null,
    studentName: "",
    degree: "",
    universityName: "",
  });
  const [purpose, setPurpose] = useState(null);

  /** Step 4 of 9 — only for "Looking for a Job" */
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [industries, setIndustries] = useState([]);

  const photoInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [connectedIds, setConnectedIds] = useState(() => new Set());
  const [notifPrefs, setNotifPrefs] = useState({
    jobAlerts: true,
    emailNotif: true,
    recommendations: true,
  });

  const [feedCompanyIds, setFeedCompanyIds] = useState(() => new Set());
  const [feedTopics, setFeedTopics] = useState(() => new Set());
  const [profileEducation, setProfileEducation] = useState("");
  const [profileExperience, setProfileExperience] = useState("");
  const [profileCertificates, setProfileCertificates] = useState("");

  const profileStrengthPct = useMemo(() => {
    let n = 0;
    if (profileEducation.trim()) n += 34;
    if (profileExperience.trim()) n += 33;
    if (profileCertificates.trim()) n += 33;
    return Math.min(100, n);
  }, [profileEducation, profileExperience, profileCertificates]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const currentStepNum = step + 1;
  const progressPct = (currentStepNum / 9) * 100;
  const accent = "#2e3171";

  function persistCommon() {
    try {
      sessionStorage.setItem(
        COMMON_STORAGE_KEY,
        JSON.stringify({
          country: location.country,
          city: location.city,
          jobTitle: identity.jobTitle,
          company: identity.company,
          status: identity.status,
          studentName: identity.studentName,
          degree: identity.degree,
          universityName: identity.universityName,
          purpose,
          skills,
          industries,
          profilePhotoSet: Boolean(photoPreview),
          connectedIds: [...connectedIds],
          notifPrefs,
          feedCompanyIds: [...feedCompanyIds],
          feedTopics: [...feedTopics],
          profileEducation,
          profileExperience,
          profileCertificates,
        })
      );
    } catch {
      /* ignore */
    }
  }

  /** After full 9-step job flow — Welcome splash first, then student dashboard. */
  function finishJobOnboarding() {
    persistCommon();
    try {
      sessionStorage.removeItem(POST_SIGNUP_EMPLOYER_KEY);
      sessionStorage.removeItem(POST_SIGNUP_INSTITUTE_KEY);
      sessionStorage.removeItem(POST_SIGNUP_COMPLETE_KEY);
    } catch {
      /* ignore */
    }
    navigate("/welcome", {
      replace: true,
      state: { next: "/student-dashboard" },
    });
  }

  function routeAfterPurpose() {
    if (purpose === "job") {
      finishJobOnboarding();
      return;
    }
    persistCommon();
    if (purpose === "hiring") {
      try {
        sessionStorage.removeItem(POST_SIGNUP_COMPLETE_KEY);
        sessionStorage.removeItem(POST_SIGNUP_INSTITUTE_KEY);
        sessionStorage.setItem(POST_SIGNUP_EMPLOYER_KEY, "1");
      } catch {
        /* ignore */
      }
      navigate("/onboarding/recruiter", { replace: true });
      return;
    }
    if (purpose === "institute") {
      try {
        sessionStorage.removeItem(POST_SIGNUP_COMPLETE_KEY);
        sessionStorage.removeItem(POST_SIGNUP_EMPLOYER_KEY);
        sessionStorage.setItem(POST_SIGNUP_INSTITUTE_KEY, "1");
      } catch {
        /* ignore */
      }
      navigate("/onboarding/institute", { replace: true });
      return;
    }
    navigate("/role-selection", { replace: true });
  }

  function addSkillFromInput() {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setSkillInput("");
  }

  function addSuggestedSkill(name) {
    if (skills.includes(name)) return;
    setSkills((prev) => [...prev, name]);
  }

  function toggleIndustry(name) {
    setIndustries((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  function isStep0Valid() {
    return Boolean(location.country.trim() && location.city.trim());
  }

  function isStep1Valid() {
    const jobTitleOk = identity.jobTitle.trim();
    const companyOk = identity.company.trim();
    if (jobTitleOk && companyOk) return true;

    if (!identity.status) return false;
    if (identity.status === "student") {
      return Boolean(
        identity.studentName.trim() &&
          identity.degree.trim() &&
          identity.universityName.trim()
      );
    }
    return Boolean(jobTitleOk && companyOk);
  }

  function handleNext() {
    if (step === 0) {
      if (!isStep0Valid()) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!isStep1Valid()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (purpose === "job") {
        setStep(3);
        return;
      }
      routeAfterPurpose();
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step === 4) {
      setStep(6);
      return;
    }
    if (step === 5) {
      setStep(6);
      return;
    }
    if (step === 6) {
      setStep(7);
      return;
    }
    if (step === 7) {
      setStep(8);
      return;
    }
  }

  function handleSkip() {
    if (step === 2) {
      navigate("/role-selection", { replace: true });
      return;
    }
    /* Skip = continue to next step (optional fields), not exit to dashboard */
    if (purpose === "job" && step >= 3 && step <= 7) {
      if (step === 4) {
        setStep(6);
        return;
      }
      setStep((s) => s + 1);
      return;
    }
    if (purpose === "job" && step === 8) {
      finishJobOnboarding();
    }
  }

  function handlePhotoChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(f));
  }

  function toggleConnect(id) {
    setConnectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleNotif(key) {
    setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function toggleFeedCompany(id) {
    setFeedCompanyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFeedTopic(topic) {
    setFeedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  function handleBack() {
    if (step === 0) {
      navigate(-1);
      return;
    }
    setStep((s) => s - 1);
  }

  const nextDisabled =
    (step === 0 && !isStep0Valid()) ||
    (step === 1 && !isStep1Valid()) ||
    (step === 2 && purpose === null);

  const showSkip = step >= 2 && step < 8;

  const isLastStep = step === 8;

  return (
    <div className="shared-onboarding-page">
      <div className="shared-onboarding-inner">
        <header className="shared-onboarding-header">
          <div className="shared-onboarding-progress-wrap">
            <div
              className="shared-onboarding-progress-track"
              role="progressbar"
              aria-valuenow={currentStepNum}
              aria-valuemin={1}
              aria-valuemax={9}
            >
              <div
                className="shared-onboarding-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="shared-onboarding-step-label">
              Step {currentStepNum} of 9
            </span>
          </div>

          <div className="shared-onboarding-icons-row">
            {NINE_STEP_META.map((meta, i) => {
              const active = i === step;
              const Icon = meta.Icon;
              return (
                <div
                  key={meta.key}
                  className={`shared-onboarding-icon-item ${
                    active ? "shared-onboarding-icon-item--active" : ""
                  }`}
                >
                  <div
                    className="shared-onboarding-icon-circle"
                    style={
                      active
                        ? { background: accent, borderColor: accent }
                        : undefined
                    }
                  >
                    <Icon aria-hidden className="shared-onboarding-step-ico" />
                  </div>
                  <span className="shared-onboarding-icon-caption">
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </header>

        <main className="shared-onboarding-card">
          {step === 0 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiMapPin aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Where are you located?
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    This helps personalize job recommendations and your network
                  </p>
                </div>
              </div>

              <label className="shared-onboarding-field-label">
                Country / Region
              </label>
              <div className="shared-onboarding-field">
                <FiGlobe className="shared-onboarding-field-ico" aria-hidden />
                <input
                  type="text"
                  placeholder="e.g., India"
                  value={location.country}
                  onChange={(e) =>
                    setLocation({ ...location, country: e.target.value })
                  }
                  autoComplete="country-name"
                />
              </div>

              <label className="shared-onboarding-field-label">City</label>
              <div className="shared-onboarding-field">
                <FiMapPin className="shared-onboarding-field-ico" aria-hidden />
                <input
                  type="text"
                  placeholder="e.g., Indore"
                  value={location.city}
                  onChange={(e) =>
                    setLocation({ ...location, city: e.target.value })
                  }
                  autoComplete="address-level2"
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiBriefcase aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Your Professional Identity
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    Tell us about your Current role
                  </p>
                </div>
              </div>

              <label className="shared-onboarding-field-label">
                Current Job Title
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={identity.jobTitle}
                  onChange={(e) =>
                    setIdentity({ ...identity, jobTitle: e.target.value })
                  }
                />
              </div>

              <label className="shared-onboarding-field-label">
                Company / Organization
              </label>
              <div className="shared-onboarding-field">
                <BsBuilding className="shared-onboarding-field-ico" aria-hidden />
                <input
                  type="text"
                  placeholder="e.g., Google"
                  value={identity.company}
                  onChange={(e) =>
                    setIdentity({ ...identity, company: e.target.value })
                  }
                />
              </div>

              <p className="shared-onboarding-status-label">
                Select your Status
              </p>
              <div className="shared-onboarding-status-row">
                <button
                  type="button"
                  className={`shared-onboarding-status-card ${
                    identity.status === "student"
                      ? "shared-onboarding-status-card--selected"
                      : ""
                  }`}
                  onClick={() =>
                    setIdentity({
                      ...identity,
                      status: "student",
                    })
                  }
                >
                  <span
                    className={`shared-onboarding-radio ${
                      identity.status === "student"
                        ? "shared-onboarding-radio--on"
                        : ""
                    }`}
                  />
                  <span className="shared-onboarding-status-ico-wrap">
                    <FaGraduationCap aria-hidden />
                  </span>
                  <span className="shared-onboarding-status-text">Student</span>
                </button>
                <button
                  type="button"
                  className={`shared-onboarding-status-card ${
                    identity.status === "jobseeker"
                      ? "shared-onboarding-status-card--selected"
                      : ""
                  }`}
                  onClick={() =>
                    setIdentity({
                      ...identity,
                      status: "jobseeker",
                      studentName: "",
                      degree: "",
                      universityName: "",
                    })
                  }
                >
                  <span
                    className={`shared-onboarding-radio ${
                      identity.status === "jobseeker"
                        ? "shared-onboarding-radio--on"
                        : ""
                    }`}
                  />
                  <span className="shared-onboarding-status-ico-wrap">
                    <FiSearch aria-hidden />
                  </span>
                  <span className="shared-onboarding-status-text">
                    Job Seeker
                  </span>
                </button>
              </div>

              {identity.status === "student" && (
                <div className="shared-onboarding-student-block">
                  <label className="shared-onboarding-field-label">
                    Name
                  </label>
                  <div className="shared-onboarding-field">
                    <FiUser
                      className="shared-onboarding-field-ico"
                      aria-hidden
                    />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={identity.studentName}
                      onChange={(e) =>
                        setIdentity({
                          ...identity,
                          studentName: e.target.value,
                        })
                      }
                      autoComplete="name"
                    />
                  </div>
                  <label className="shared-onboarding-field-label">
                    Degree
                  </label>
                  <div className="shared-onboarding-field">
                    <FiBook
                      className="shared-onboarding-field-ico"
                      aria-hidden
                    />
                    <input
                      type="text"
                      placeholder="e.g., B.Tech Computer Science"
                      value={identity.degree}
                      onChange={(e) =>
                        setIdentity({ ...identity, degree: e.target.value })
                      }
                    />
                  </div>
                  <label className="shared-onboarding-field-label">
                    University Name
                  </label>
                  <div className="shared-onboarding-field">
                    <FiMapPin
                      className="shared-onboarding-field-ico"
                      aria-hidden
                    />
                    <input
                      type="text"
                      placeholder="e.g., ABC University"
                      value={identity.universityName}
                      onChange={(e) =>
                        setIdentity({
                          ...identity,
                          universityName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FaBullseye aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    What brings you here?
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    This tailors your onboarding experience
                  </p>
                </div>
              </div>

              <div className="shared-onboarding-purpose-list">
                <button
                  type="button"
                  className={`shared-onboarding-purpose ${
                    purpose === "job" ? "shared-onboarding-purpose--selected" : ""
                  }`}
                  onClick={() => setPurpose("job")}
                >
                  <span
                    className={`shared-onboarding-radio ${
                      purpose === "job" ? "shared-onboarding-radio--on" : ""
                    }`}
                  />
                  <span className="shared-onboarding-purpose-ico">
                    <FiSearch aria-hidden />
                  </span>
                  <span className="shared-onboarding-purpose-text">
                    <strong>Looking for a Job</strong>
                    <span>
                      Find opportunities that match your skills
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className={`shared-onboarding-purpose ${
                    purpose === "hiring"
                      ? "shared-onboarding-purpose--selected"
                      : ""
                  }`}
                  onClick={() => setPurpose("hiring")}
                >
                  <span
                    className={`shared-onboarding-radio ${
                      purpose === "hiring" ? "shared-onboarding-radio--on" : ""
                    }`}
                  />
                  <span className="shared-onboarding-purpose-ico">
                    <FiUserPlus aria-hidden />
                  </span>
                  <span className="shared-onboarding-purpose-text">
                    <strong>Hiring</strong>
                    <span>
                      Find opportunities that match your skills
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className={`shared-onboarding-purpose ${
                    purpose === "institute"
                      ? "shared-onboarding-purpose--selected"
                      : ""
                  }`}
                  onClick={() => setPurpose("institute")}
                >
                  <span
                    className={`shared-onboarding-radio ${
                      purpose === "institute"
                        ? "shared-onboarding-radio--on"
                        : ""
                    }`}
                  />
                  <span className="shared-onboarding-purpose-ico">
                    <FiUsers aria-hidden />
                  </span>
                  <span className="shared-onboarding-purpose-text">
                    <strong>Training Institute</strong>
                    <span>
                      Find opportunities that match your skills
                    </span>
                  </span>
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiClipboard aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Skills and Interests
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    Add Skills and industries to improve recommendations
                  </p>
                </div>
              </div>

              <p className="shared-onboarding-skill-section-label">Add Skills</p>
              <div className="shared-onboarding-skill-input-wrap">
                <input
                  type="text"
                  placeholder="e.g., React, Marketing"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillFromInput();
                    }
                  }}
                  className="shared-onboarding-skill-input"
                />
                <button
                  type="button"
                  className="shared-onboarding-skill-add-btn"
                  onClick={addSkillFromInput}
                  aria-label="Add skill"
                >
                  <FiPlus aria-hidden />
                </button>
              </div>

              <div className="shared-onboarding-skill-tags">
                {SUGGESTED_SKILL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="shared-onboarding-skill-tag"
                    onClick={() => addSuggestedSkill(tag)}
                  >
                    + {tag}
                  </button>
                ))}
              </div>

              <p className="shared-onboarding-skill-section-label shared-onboarding-industry-heading">
                Industries of Interest
              </p>
              <div className="shared-onboarding-industry-grid">
                {INDUSTRY_OPTIONS.map((name) => (
                  <label key={name} className="shared-onboarding-industry-item">
                    <input
                      type="checkbox"
                      checked={industries.includes(name)}
                      onChange={() => toggleIndustry(name)}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiCamera aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Add a profile Photo
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    optional but strongly encouraged — improves profile visibility.
                  </p>
                </div>
              </div>

              <div className="shared-onboarding-photo-zone">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="shared-onboarding-photo-input"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  className="shared-onboarding-photo-circle"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt=""
                      className="shared-onboarding-photo-preview"
                    />
                  ) : (
                    <FiCamera
                      className="shared-onboarding-photo-circle-ico"
                      aria-hidden
                    />
                  )}
                </button>
                <button
                  type="button"
                  className="shared-onboarding-upload-btn"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <FiCamera aria-hidden />
                  Upload Photo
                </button>
                <p className="shared-onboarding-photo-hint">
                  Profiles with photos get up to 21x more views and 9x more
                  Connection requests.
                </p>
              </div>

              {(identity.status === "student" ||
                identity.jobTitle ||
                identity.company) && (
                <div className="shared-onboarding-profile-preview">
                  <div className="shared-onboarding-profile-preview-inner">
                    <div className="shared-onboarding-profile-preview-photo">
                      {photoPreview ? (
                        <img src={photoPreview} alt="" />
                      ) : (
                        <span className="shared-onboarding-profile-preview-initials">
                          {identity.status === "student" &&
                          identity.studentName.trim()
                            ? identity.studentName
                                .trim()
                                .split(/\s+/)
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : identity.jobTitle.trim()
                              ? identity.jobTitle
                                  .trim()
                                  .split(/\s+/)
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()
                              : "?"}
                        </span>
                      )}
                    </div>
                    <div className="shared-onboarding-profile-preview-text">
                      {identity.status === "student" ? (
                        <>
                          <p className="shared-onboarding-profile-preview-line shared-onboarding-profile-preview-line--primary">
                            {identity.degree.trim() || "Degree"}
                          </p>
                          <p className="shared-onboarding-profile-preview-line shared-onboarding-profile-preview-uni">
                            {identity.universityName.trim() || "University"}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="shared-onboarding-profile-preview-line shared-onboarding-profile-preview-line--primary">
                            {identity.jobTitle.trim() || "Your role"}
                          </p>
                          <p className="shared-onboarding-profile-preview-line shared-onboarding-profile-preview-uni">
                            {identity.company.trim() || "Company"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="shared-onboarding-profile-preview-caption">
                    How your profile can look to others
                  </p>
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiUsers aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Connect with People
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    Build your network with people you may know.
                  </p>
                </div>
              </div>

              <button type="button" className="shared-onboarding-import-box">
                <FiMail className="shared-onboarding-import-ico" aria-hidden />
                <span>
                  <strong>Import email contacts</strong>
                  <span>Find people you already know.</span>
                </span>
              </button>

              <p className="shared-onboarding-connect-heading">
                PEOPLE YOU MAY KNOW
              </p>
              <ul className="shared-onboarding-connect-list">
                {CONNECT_SUGGESTIONS.map((p) => (
                  <li key={p.id} className="shared-onboarding-connect-row">
                    <span className="shared-onboarding-connect-avatar">
                      {p.initials}
                    </span>
                    <span className="shared-onboarding-connect-meta">
                      <strong>{p.name}</strong>
                      <span>{p.sub}</span>
                    </span>
                    <button
                      type="button"
                      className={
                        connectedIds.has(p.id)
                          ? "shared-onboarding-connect-btn shared-onboarding-connect-btn--on"
                          : "shared-onboarding-connect-btn"
                      }
                      onClick={() => toggleConnect(p.id)}
                    >
                      {connectedIds.has(p.id) ? "Connected" : "+ Connect"}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 6 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiBell aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Notification &amp; Preferences
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    Choose what updates you&apos;d like to receive
                  </p>
                </div>
              </div>

              <div className="shared-onboarding-toggle-list">
                <div className="shared-onboarding-toggle-row">
                  <FiBriefcase
                    className="shared-onboarding-toggle-ico"
                    aria-hidden
                  />
                  <div className="shared-onboarding-toggle-text">
                    <strong>Job Alerts</strong>
                    <span>Get notified about relevant job openings</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifPrefs.jobAlerts}
                    className={`shared-onboarding-switch ${
                      notifPrefs.jobAlerts ? "shared-onboarding-switch--on" : ""
                    }`}
                    onClick={() => toggleNotif("jobAlerts")}
                  />
                </div>
                <div className="shared-onboarding-toggle-row">
                  <FiMail
                    className="shared-onboarding-toggle-ico"
                    aria-hidden
                  />
                  <div className="shared-onboarding-toggle-text">
                    <strong>Email Notification</strong>
                    <span>Receive updates via email</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifPrefs.emailNotif}
                    className={`shared-onboarding-switch ${
                      notifPrefs.emailNotif ? "shared-onboarding-switch--on" : ""
                    }`}
                    onClick={() => toggleNotif("emailNotif")}
                  />
                </div>
                <div className="shared-onboarding-toggle-row">
                  <FiTrendingUp
                    className="shared-onboarding-toggle-ico"
                    aria-hidden
                  />
                  <div className="shared-onboarding-toggle-text">
                    <strong>Recommendations</strong>
                    <span>Get personalized content suggestions</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifPrefs.recommendations}
                    className={`shared-onboarding-switch ${
                      notifPrefs.recommendations
                        ? "shared-onboarding-switch--on"
                        : ""
                    }`}
                    onClick={() => toggleNotif("recommendations")}
                  />
                </div>
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiRss aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Personalize your feed
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    Follow companies and topics to build your home feed
                  </p>
                </div>
              </div>

              <p className="shared-onboarding-feed-section-label">COMPANIES</p>
              <div className="shared-onboarding-feed-companies">
                {FEED_COMPANIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`shared-onboarding-feed-co ${
                      feedCompanyIds.has(c.id)
                        ? "shared-onboarding-feed-co--selected"
                        : ""
                    }`}
                    onClick={() => toggleFeedCompany(c.id)}
                  >
                    <span className="shared-onboarding-feed-co-ico" aria-hidden />
                    <strong>{c.name}</strong>
                    <span>{c.followers} followers</span>
                  </button>
                ))}
              </div>

              <p className="shared-onboarding-feed-topics-label">Topics</p>
              <div className="shared-onboarding-feed-topics">
                {FEED_TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`shared-onboarding-feed-topic-pill ${
                      feedTopics.has(t)
                        ? "shared-onboarding-feed-topic-pill--selected"
                        : ""
                    }`}
                    onClick={() => toggleFeedTopic(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 8 && (
            <>
              <div className="shared-onboarding-card-head">
                <div
                  className="shared-onboarding-card-icon"
                  style={{ background: accent }}
                >
                  <FiAward aria-hidden />
                </div>
                <div>
                  <h1 className="shared-onboarding-card-title">
                    Complete your Profile
                  </h1>
                  <p className="shared-onboarding-card-sub">
                    Add more details to stand out
                  </p>
                </div>
              </div>

              <div className="shared-onboarding-strength-block">
                <div className="shared-onboarding-strength-row">
                  <span>Profile Strength</span>
                  <span>{profileStrengthPct}%</span>
                </div>
                <div className="shared-onboarding-strength-bar">
                  <div
                    className="shared-onboarding-strength-fill"
                    style={{ width: `${profileStrengthPct}%` }}
                  />
                </div>
                <p className="shared-onboarding-strength-hint">
                  Add more details to reach All-Star status
                </p>
              </div>

              <label className="shared-onboarding-field-label">Education</label>
              <div className="shared-onboarding-field">
                <FaGraduationCap
                  className="shared-onboarding-field-ico"
                  aria-hidden
                />
                <input
                  type="text"
                  placeholder="e.g. BS Computer Science"
                  value={profileEducation}
                  onChange={(e) => setProfileEducation(e.target.value)}
                />
              </div>

              <label className="shared-onboarding-field-label">Experience</label>
              <div className="shared-onboarding-field">
                <FiBriefcase
                  className="shared-onboarding-field-ico"
                  aria-hidden
                />
                <input
                  type="text"
                  placeholder="e.g. 3 years at Google"
                  value={profileExperience}
                  onChange={(e) => setProfileExperience(e.target.value)}
                />
              </div>

              <label className="shared-onboarding-field-label">
                Certificates
              </label>
              <div className="shared-onboarding-field">
                <FiFileText
                  className="shared-onboarding-field-ico"
                  aria-hidden
                />
                <input
                  type="text"
                  placeholder="e.g. AWS Solution Architect"
                  value={profileCertificates}
                  onChange={(e) => setProfileCertificates(e.target.value)}
                />
              </div>
            </>
          )}
        </main>

        <footer className="shared-onboarding-footer">
          {step > 0 ? (
            <button
              type="button"
              className="shared-onboarding-back"
              onClick={handleBack}
            >
              <FiChevronLeft aria-hidden className="shared-onboarding-back-ico" />
              Back
            </button>
          ) : (
            <span className="shared-onboarding-footer-spacer" />
          )}
          <div className="shared-onboarding-footer-actions">
            {showSkip && (
              <button
                type="button"
                className="shared-onboarding-skip"
                onClick={handleSkip}
              >
                Skip
              </button>
            )}
            {isLastStep ? (
              <button
                type="button"
                className="shared-onboarding-next shared-onboarding-finish"
                onClick={finishJobOnboarding}
              >
                Finish
              </button>
            ) : (
              <button
                type="button"
                className="shared-onboarding-next"
                onClick={handleNext}
                disabled={nextDisabled}
              >
                Next
                <FiChevronRight aria-hidden />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SharedOnboarding;
