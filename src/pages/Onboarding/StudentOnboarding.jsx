import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { POST_SIGNUP_COMPLETE_KEY } from "../../constants/registration";
import "./StudentOnboarding.css";

const STEPS = [
  {
    title: "Skills & interests",
    subtitle: "Add skills and industries so we can match you to the right roles.",
  },
  {
    title: "Profile photo",
    subtitle: "Optional but strongly encouraged — it improves visibility.",
  },
  {
    title: "Connect with people",
    subtitle: "Suggestions based on contacts, colleagues, and people you may know.",
  },
  {
    title: "Notifications & preferences",
    subtitle: "Choose how you want to hear about opportunities.",
  },
  {
    title: "Feed personalization",
    subtitle: "Follow companies, voices, and topics to build your home feed.",
  },
  {
    title: "Complete your profile",
    subtitle: "Add education, experience, and certifications — aim for 100% strength.",
  },
];

const INDUSTRY_OPTIONS = [
  "IT & Software",
  "SaaS",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "E-commerce",
];

const FEED_COMPANIES = ["Google", "Microsoft", "Infosys", "TCS", "Zoho"];
const FEED_PEOPLE = ["Tech Leadership", "Career Tips India", "Hiring Alerts"];
const FEED_TOPICS = ["React", "System Design", "Interview Prep", "Remote Jobs"];

const SUGGESTED_CONNECTIONS = [
  { id: "1", name: "Ananya Sharma", sub: "Colleague · Acme Labs", initials: "AS" },
  { id: "2", name: "Rahul Verma", sub: "From your contacts", initials: "RV" },
  { id: "3", name: "Priya Nair", sub: "People you may know", initials: "PN" },
];

function StudentOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const canShowExtendedOnboarding =
    typeof window !== "undefined" &&
    (() => {
      try {
        return sessionStorage.getItem(POST_SIGNUP_COMPLETE_KEY) === "1";
      } catch {
        return false;
      }
    })();

  if (!canShowExtendedOnboarding) {
    return <Navigate to="/student" replace />;
  }

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [industries, setIndustries] = useState([]);

  const [connected, setConnected] = useState(() => new Set());

  const [prefs, setPrefs] = useState({
    jobAlerts: true,
    emailNotif: true,
    recommendations: true,
  });

  const [feedPick, setFeedPick] = useState({
    companies: new Set(),
    people: new Set(),
    topics: new Set(),
  });

  const [finalForm, setFinalForm] = useState({
    education: "",
    experience: "",
    certifications: "",
  });

  function addSkill() {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setSkillInput("");
  }

  function removeSkill(s) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  function toggleIndustry(name) {
    setIndustries((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  function toggleFeed(cat, name) {
    setFeedPick((prev) => {
      const next = new Set(prev[cat]);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...prev, [cat]: next };
    });
  }

  function togglePref(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function toggleConnect(id) {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const strengthPct = useMemo(() => {
    let score = 15;
    if (skills.length) score += 20;
    if (industries.length) score += 15;
    if (finalForm.education.trim()) score += 18;
    if (finalForm.experience.trim()) score += 18;
    if (finalForm.certifications.trim()) score += 14;
    return Math.min(100, score);
  }, [skills, industries, finalForm]);

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    try {
      sessionStorage.removeItem(POST_SIGNUP_COMPLETE_KEY);
    } catch {
      /* ignore */
    }
    navigate("/welcome", {
      replace: true,
      state: { next: "/student-dashboard" },
    });
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  const meta = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <OnboardingShell
      roleLabel="Aspirants"
      currentStepIndex={step}
      stepTitle={meta.title}
      stepSubtitle={meta.subtitle}
      onBack={back}
      onNext={next}
      isLastStep={isLast}
    >
      {step === 0 && (
        <>
          <div className="ob-field">
            <label className="ob-label">Skills (e.g. Java, Spring Boot, Marketing)</label>
            <div className="stu-skill-add">
              <input
                className="ob-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                className="stu-add-skill-btn"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="stu-tags">
                {skills.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="stu-tag"
                    onClick={() => removeSkill(s)}
                  >
                    {s} ×
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ob-field">
            <span className="ob-label">Industries of interest</span>
            <div className="ob-chip-grid">
              {INDUSTRY_OPTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`ob-chip ${industries.includes(name) ? "is-selected" : ""}`}
                  onClick={() => toggleIndustry(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <p className="ob-photo-hint">
            A clear face photo helps recruiters recognize you. You can skip and
            add later from your profile.
          </p>
          <div className="ob-field">
            <label className="ob-label">Upload photo (optional)</label>
            <input className="ob-input" type="file" accept="image/*" />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {SUGGESTED_CONNECTIONS.map((c) => (
            <div key={c.id} className="ob-connection-card">
              <div className="ob-connection-main">
                <div className="ob-avatar-sm">{c.initials}</div>
                <div>
                  <div className="stu-conn-name">{c.name}</div>
                  <div className="stu-conn-sub">{c.sub}</div>
                </div>
              </div>
              <button
                type="button"
                className={
                  connected.has(c.id) ? "stu-conn-done" : "stu-conn-btn"
                }
                onClick={() => toggleConnect(c.id)}
              >
                {connected.has(c.id) ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <div className="ob-toggle-row">
            <span>Job alerts</span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.jobAlerts}
              className={`ob-switch ${prefs.jobAlerts ? "is-on" : ""}`}
              onClick={() => togglePref("jobAlerts")}
            >
              <span className="ob-switch-knob" />
            </button>
          </div>
          <div className="ob-toggle-row">
            <span>Email notifications</span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.emailNotif}
              className={`ob-switch ${prefs.emailNotif ? "is-on" : ""}`}
              onClick={() => togglePref("emailNotif")}
            >
              <span className="ob-switch-knob" />
            </button>
          </div>
          <div className="ob-toggle-row">
            <span>Recommendations</span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.recommendations}
              className={`ob-switch ${prefs.recommendations ? "is-on" : ""}`}
              onClick={() => togglePref("recommendations")}
            >
              <span className="ob-switch-knob" />
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <p className="ob-photo-hint">
            Tap to follow — we&apos;ll use this to personalize your feed.
          </p>
          <span className="ob-label">Companies</span>
          <div className="ob-chip-grid" style={{ marginBottom: 16 }}>
            {FEED_COMPANIES.map((name) => (
              <button
                key={name}
                type="button"
                className={`ob-chip ${feedPick.companies.has(name) ? "is-selected" : ""}`}
                onClick={() => toggleFeed("companies", name)}
              >
                {name}
              </button>
            ))}
          </div>
          <span className="ob-label">Influencers & voices</span>
          <div className="ob-chip-grid" style={{ marginBottom: 16 }}>
            {FEED_PEOPLE.map((name) => (
              <button
                key={name}
                type="button"
                className={`ob-chip ${feedPick.people.has(name) ? "is-selected" : ""}`}
                onClick={() => toggleFeed("people", name)}
              >
                {name}
              </button>
            ))}
          </div>
          <span className="ob-label">Topics</span>
          <div className="ob-chip-grid">
            {FEED_TOPICS.map((name) => (
              <button
                key={name}
                type="button"
                className={`ob-chip ${feedPick.topics.has(name) ? "is-selected" : ""}`}
                onClick={() => toggleFeed("topics", name)}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <div className="ob-field">
            <label className="ob-label">Education</label>
            <textarea
              className="ob-textarea"
              value={finalForm.education}
              onChange={(e) =>
                setFinalForm({ ...finalForm, education: e.target.value })
              }
              placeholder="Degree, institution, year"
            />
          </div>
          <div className="ob-field">
            <label className="ob-label">Experience</label>
            <textarea
              className="ob-textarea"
              value={finalForm.experience}
              onChange={(e) =>
                setFinalForm({ ...finalForm, experience: e.target.value })
              }
              placeholder="Roles, companies, impact"
            />
          </div>
          <div className="ob-field">
            <label className="ob-label">Certifications</label>
            <textarea
              className="ob-textarea"
              value={finalForm.certifications}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  certifications: e.target.value,
                })
              }
              placeholder="Courses, certs, licenses"
            />
          </div>
          <p className="ob-strength-label">Profile strength</p>
          <div className="ob-meter">
            <div
              className="ob-meter-fill"
              style={{ width: `${strengthPct}%` }}
            />
          </div>
          <p className="stu-strength-pct">{strengthPct}%</p>
        </>
      )}
    </OnboardingShell>
  );
}

export default StudentOnboarding;
