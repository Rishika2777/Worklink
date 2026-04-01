import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { POST_SIGNUP_INSTITUTE_KEY } from "../../constants/registration";
import "./SharedOnboarding.css";
import "./OnboardingShell.css";
import "./StudentOnboarding.css";
import "./InstituteOnboarding.css";

/** Steps 7–12 of 12 (after SharedOnboarding location → identity → purpose for institute). */
const STEPS = [
  {
    title: "Institution Details",
    subtitle: "Name, type (College / University / Training Institute), and location.",
  },
  {
    title: "Verification / Authority",
    subtitle: "Official email verification and admin contact.",
  },
  {
    title: "Student Base Setup",
    subtitle: "Upload a student list (CSV) or invite students via link.",
  },
  {
    title: "Placement Preferences",
    subtitle: "Industries, companies to target, and placement stats.",
  },
  {
    title: "Create Institute Page",
    subtitle: "About, courses offered, and placement highlights.",
  },
  {
    title: "Connect with Companies",
    subtitle: "Suggested recruiters and partnership requests.",
  },
];

/** Same icon strip pattern as job-seeker shared onboarding — 6 substeps for institute. */
const INSTITUTE_STEP_META = [
  { key: "details", label: "Details", Icon: BsBuilding },
  { key: "verify", label: "Verify", Icon: FiShield },
  { key: "students", label: "Students", Icon: FiUsers },
  { key: "placement", label: "Placement", Icon: FiTarget },
  { key: "page", label: "Page", Icon: FiFileText },
  { key: "connect", label: "Connect", Icon: FiBriefcase },
];

const ACCENT = "#2e3171";

const INSTITUTE_TYPES = ["College", "University", "Training Institute"];

const INDUSTRY_OPTIONS = [
  "IT & Software",
  "SaaS",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Consulting",
  "E-commerce",
];

const MOCK_RECRUITERS = [
  { id: "r1", name: "Campus Talent Partners", sub: "Hiring for product & engineering", initials: "CT" },
  { id: "r2", name: "Nexus Recruit India", sub: "Bulk campus drives · PAN India", initials: "NR" },
  { id: "r3", name: "WorkLink Enterprise", sub: "Training-to-hire programs", initials: "WL" },
];

function InstituteOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [institution, setInstitution] = useState({
    name: "",
    type: "",
    location: "",
  });

  const [verification, setVerification] = useState({
    officialEmail: "",
    code: "123456",
    adminName: "",
    adminPhone: "",
  });

  const [studentBase, setStudentBase] = useState({
    csvChosen: false,
    inviteLink: "",
  });

  const [placement, setPlacement] = useState({
    industries: [],
    companiesTarget: "",
    placementStats: "",
  });

  const [institutePage, setInstitutePage] = useState({
    about: "",
    coursesOffered: "",
    placementHighlights: "",
  });

  const [partnershipRequested, setPartnershipRequested] = useState(() => new Set());

  const canShowExtended = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(POST_SIGNUP_INSTITUTE_KEY) === "1";
    } catch {
      return false;
    }
  }, []);

  const nextDisabled = useMemo(() => {
    if (step === 0) {
      return (
        !institution.name.trim() ||
        !institution.type ||
        !institution.location.trim()
      );
    }
    if (step === 1) {
      return (
        !verification.officialEmail.trim() ||
        !/^\d{6}$/.test(verification.code.trim()) ||
        !verification.adminName.trim() ||
        !verification.adminPhone.trim()
      );
    }
    if (step === 2) {
      return !studentBase.csvChosen && !studentBase.inviteLink;
    }
    if (step === 3) {
      return (
        placement.industries.length === 0 ||
        !placement.companiesTarget.trim()
      );
    }
    if (step === 4) {
      return (
        !institutePage.about.trim() || !institutePage.coursesOffered.trim()
      );
    }
    return false;
  }, [step, institution, verification, studentBase, placement, institutePage]);

  if (!canShowExtended) {
    return <Navigate to="/institute" replace />;
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    try {
      sessionStorage.removeItem(POST_SIGNUP_INSTITUTE_KEY);
    } catch {
      /* ignore */
    }
    navigate("/welcome", {
      replace: true,
      state: { next: "/institute-dashboard" },
    });
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function toggleIndustry(name) {
    setPlacement((prev) => ({
      ...prev,
      industries: prev.industries.includes(name)
        ? prev.industries.filter((x) => x !== name)
        : [...prev.industries, name],
    }));
  }

  function generateInviteLink() {
    const token = Math.random().toString(36).slice(2, 12);
    setStudentBase((s) => ({
      ...s,
      inviteLink: `https://worklink.app/inst/join/${token}`,
    }));
  }

  function onCsvChange(e) {
    const f = e.target.files?.[0];
    setStudentBase((s) => ({ ...s, csvChosen: Boolean(f) }));
  }

  function togglePartnership(id) {
    setPartnershipRequested((prev) => {
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
  const StepHeaderIcon = INSTITUTE_STEP_META[step].Icon;

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
            {INSTITUTE_STEP_META.map((m, i) => {
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
              <label className="shared-onboarding-field-label" htmlFor="ins-name">
                Name
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="ins-name"
                  type="text"
                  value={institution.name}
                  onChange={(e) =>
                    setInstitution({ ...institution, name: e.target.value })
                  }
                  placeholder="e.g. Delhi Technical Institute"
                  autoComplete="organization"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="ins-type">
                Type
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain institute-field-select-wrap">
                <select
                  id="ins-type"
                  className="institute-shared-select"
                  value={institution.type}
                  onChange={(e) =>
                    setInstitution({ ...institution, type: e.target.value })
                  }
                >
                  <option value="">Select type</option>
                  {INSTITUTE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <label className="shared-onboarding-field-label" htmlFor="ins-loc">
                Location
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="ins-loc"
                  type="text"
                  value={institution.location}
                  onChange={(e) =>
                    setInstitution({ ...institution, location: e.target.value })
                  }
                  placeholder="City, State / Region"
                  autoComplete="address-level1"
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="ins-verify-lead">
                We&apos;ll send a code to your <strong>official institute email</strong> when
                the mailbox is connected. For now, use the demo code to continue.
              </p>
              <h3 className="ins-step-section-title">Official email verification</h3>
              <label className="shared-onboarding-field-label" htmlFor="ins-off-email">
                Official email
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="ins-off-email"
                  type="email"
                  value={verification.officialEmail}
                  onChange={(e) =>
                    setVerification({
                      ...verification,
                      officialEmail: e.target.value,
                    })
                  }
                  placeholder="registrar@institute.edu"
                  autoComplete="email"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="ins-code">
                Verification code
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="ins-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={verification.code}
                  onChange={(e) =>
                    setVerification({
                      ...verification,
                      code: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                  placeholder="000000"
                />
              </div>
              <h3 className="ins-step-section-title">Admin contact</h3>
              <label className="shared-onboarding-field-label" htmlFor="ins-admin-name">
                Name
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="ins-admin-name"
                  type="text"
                  value={verification.adminName}
                  onChange={(e) =>
                    setVerification({
                      ...verification,
                      adminName: e.target.value,
                    })
                  }
                  placeholder="Placement officer or TPO"
                />
              </div>
              <label className="shared-onboarding-field-label" htmlFor="ins-admin-phone">
                Phone
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain">
                <input
                  id="ins-admin-phone"
                  inputMode="tel"
                  value={verification.adminPhone}
                  onChange={(e) =>
                    setVerification({
                      ...verification,
                      adminPhone: e.target.value,
                    })
                  }
                  placeholder="+91 …"
                  autoComplete="tel"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="ins-step-section-title ins-step-after-card-head">
                Upload student list (CSV)
              </h3>
              <label className="shared-onboarding-field-label" htmlFor="ins-csv">
                Choose a .csv file
              </label>
              <div className="shared-onboarding-field shared-onboarding-field--plain institute-file-field">
                <input
                  id="ins-csv"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={onCsvChange}
                />
              </div>
              {studentBase.csvChosen && (
                <p className="ins-file-hint">
                  File selected — students will import when your backend is connected.
                </p>
              )}
              <div className="ins-or-divider">
                <span>or</span>
              </div>
              <h3 className="ins-step-section-title">Invite students via link</h3>
              <p className="ins-invite-hint">Generate a secure invite URL</p>
              <button
                type="button"
                className="ins-generate-btn"
                onClick={generateInviteLink}
              >
                Generate invite link
              </button>
              {studentBase.inviteLink ? (
                <div className="ins-invite-box">
                  <code>{studentBase.inviteLink}</code>
                  <button
                    type="button"
                    className="ins-copy-btn"
                    onClick={() =>
                      navigator.clipboard?.writeText(studentBase.inviteLink)
                    }
                  >
                    Copy
                  </button>
                </div>
              ) : null}
            </>
          )}

          {step === 3 && (
            <>
              <span className="shared-onboarding-field-label">
                Industries (select one or more)
              </span>
              <div className="ob-chip-grid institute-chip-wrap">
                {INDUSTRY_OPTIONS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`ob-chip ${placement.industries.includes(name) ? "is-selected" : ""}`}
                    onClick={() => toggleIndustry(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <label className="shared-onboarding-field-label" htmlFor="ins-companies">
                Companies to target
              </label>
              <textarea
                id="ins-companies"
                className="institute-shared-textarea"
                value={placement.companiesTarget}
                onChange={(e) =>
                  setPlacement({
                    ...placement,
                    companiesTarget: e.target.value,
                  })
                }
                placeholder="Dream employers, preferred partners, or sectors."
              />
              <label className="shared-onboarding-field-label" htmlFor="ins-stats">
                Placement stats
              </label>
              <textarea
                id="ins-stats"
                className="institute-shared-textarea"
                value={placement.placementStats}
                onChange={(e) =>
                  setPlacement({
                    ...placement,
                    placementStats: e.target.value,
                  })
                }
                placeholder="e.g. 120+ offers · avg. package · % placed"
              />
            </>
          )}

          {step === 4 && (
            <>
              <label className="shared-onboarding-field-label" htmlFor="ins-about">
                About
              </label>
              <textarea
                id="ins-about"
                className="institute-shared-textarea"
                value={institutePage.about}
                onChange={(e) =>
                  setInstitutePage({ ...institutePage, about: e.target.value })
                }
                placeholder="History, vision, and what makes your institute stand out."
              />
              <label className="shared-onboarding-field-label" htmlFor="ins-courses">
                Courses offered
              </label>
              <textarea
                id="ins-courses"
                className="institute-shared-textarea"
                value={institutePage.coursesOffered}
                onChange={(e) =>
                  setInstitutePage({
                    ...institutePage,
                    coursesOffered: e.target.value,
                  })
                }
                placeholder="Programs, specializations, duration."
              />
              <label className="shared-onboarding-field-label" htmlFor="ins-highlights">
                Placement highlights
              </label>
              <textarea
                id="ins-highlights"
                className="institute-shared-textarea"
                value={institutePage.placementHighlights}
                onChange={(e) =>
                  setInstitutePage({
                    ...institutePage,
                    placementHighlights: e.target.value,
                  })
                }
                placeholder="Top recruiters, notable outcomes, success stories."
              />
            </>
          )}

          {step === 5 && (
            <>
              <h3 className="ins-step-section-title ins-step-inline-title">
                Suggested recruiters
              </h3>
              <p className="ob-photo-hint ins-connect-intro">
                These suggestions align with your industries and placement preferences.
              </p>
              <h3 className="ins-step-section-title ins-step-section-title--spaced">
                Partnership requests
              </h3>
              <p className="ins-connect-sub">
                Request a partnership to start a conversation with a recruiter or agency.
              </p>
              {MOCK_RECRUITERS.map((r) => (
                <div key={r.id} className="ob-connection-card">
                  <div className="ob-connection-main">
                    <div className="ob-avatar-sm">{r.initials}</div>
                    <div>
                      <div className="stu-conn-name">{r.name}</div>
                      <div className="stu-conn-sub">{r.sub}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={
                      partnershipRequested.has(r.id)
                        ? "stu-conn-done"
                        : "ins-partner-btn"
                    }
                    onClick={() => togglePartnership(r.id)}
                  >
                    {partnershipRequested.has(r.id)
                      ? "Request sent"
                      : "Request partnership"}
                  </button>
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

export default InstituteOnboarding;
