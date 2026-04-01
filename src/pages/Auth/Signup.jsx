import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import robot from "../../assets/images/robot-login.png";
import { FaApple } from "react-icons/fa";
import {
  FiArrowRight,
  FiBriefcase,
  FiLock,
  FiMail,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

import {
  POST_SIGNUP_COMPLETE_KEY,
  POST_SIGNUP_EMPLOYER_KEY,
  POST_SIGNUP_INSTITUTE_KEY,
} from "../../constants/registration";

const TOTAL_STEPS = 5;

const STEP_HEADINGS = [
  "Join now",
  "Basic information",
  "Verify your email",
  "Location & profile basics",
  "Professional identity",
];

const STEP_SUBS = [
  "Choose email & password or continue with a provider.",
  "Tell us who you are and how to reach you.",
  "Enter the code we sent to activate your account.",
  "Helps personalize job recommendations and your network.",
  "How you show up professionally — like LinkedIn.",
];

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [oauthProvider, setOauthProvider] = useState(null);

  const [basic, setBasic] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /** Pre-filled until email API exists — user can tap Continue immediately. */
  const [code, setCode] = useState("123456");

  const [location, setLocation] = useState({
    country: "",
    city: "",
  });

  const [professional, setProfessional] = useState({
    mode: "employer",
    jobTitle: "",
    company: "",
  });

  function goNext() {
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleOAuth(provider) {
    setOauthProvider(provider);
    setBasic((b) => ({
      ...b,
      email: b.email || `${provider}.user@example.com`,
    }));
    setStep(1);
  }

  function handleContinueEmail() {
    setOauthProvider(null);
    setStep(1);
  }

  function handleBasicSubmit(e) {
    e.preventDefault();
    if (!basic.firstName.trim() || !basic.lastName.trim() || !basic.email.trim()) {
      return;
    }
    if (!oauthProvider && !basic.password.trim()) {
      return;
    }
    goNext();
  }

  function handleVerifySubmit(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      return;
    }
    goNext();
  }

  function handleLocationSubmit(e) {
    e.preventDefault();
    if (!location.country.trim() || !location.city.trim()) {
      return;
    }
    goNext();
  }

  function goStudentOnboarding() {
    try {
      sessionStorage.removeItem(POST_SIGNUP_EMPLOYER_KEY);
      sessionStorage.removeItem(POST_SIGNUP_INSTITUTE_KEY);
      sessionStorage.setItem(POST_SIGNUP_COMPLETE_KEY, "1");
    } catch {
      /* ignore */
    }
    navigate("/onboarding/student");
  }

  function goEmployerOnboarding() {
    try {
      sessionStorage.removeItem(POST_SIGNUP_COMPLETE_KEY);
      sessionStorage.removeItem(POST_SIGNUP_INSTITUTE_KEY);
      sessionStorage.setItem(POST_SIGNUP_EMPLOYER_KEY, "1");
    } catch {
      /* ignore */
    }
    navigate("/onboarding/recruiter");
  }

  function goInstituteOnboarding() {
    try {
      sessionStorage.removeItem(POST_SIGNUP_COMPLETE_KEY);
      sessionStorage.removeItem(POST_SIGNUP_EMPLOYER_KEY);
      sessionStorage.setItem(POST_SIGNUP_INSTITUTE_KEY, "1");
    } catch {
      /* ignore */
    }
    navigate("/onboarding/institute");
  }

  function handleProfessionalSubmit(e) {
    e.preventDefault();
    if (professional.mode === "employer") {
      if (!professional.jobTitle.trim() || !professional.company.trim()) {
        return;
      }
      goEmployerOnboarding();
      return;
    }
    if (professional.mode === "student") {
      goStudentOnboarding();
      return;
    }
    if (professional.mode === "institute") {
      goInstituteOnboarding();
    }
  }

  const displayStep = step + 1;
  const progressPct = (displayStep / TOTAL_STEPS) * 100;

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-form-area signup-wizard">
          <span className="signup-badge">Get started</span>

          <div className="signup-step-meta" aria-live="polite">
            Step {displayStep} of {TOTAL_STEPS}
          </div>
          <div className="signup-progress-track" aria-hidden>
            <div
              className="signup-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <h2 className="signup-heading">{STEP_HEADINGS[step]}</h2>
          <p className="signup-subtext">{STEP_SUBS[step]}</p>

          {/* —— Step 1: Entry —— */}
          {step === 0 && (
            <div className="signup-step-body">
              <button
                type="button"
                className="signup-oauth signup-oauth-google"
                onClick={() => handleOAuth("google")}
              >
                <span className="signup-oauth-icon" aria-hidden>G</span>
                Continue with Google
              </button>
              <button
                type="button"
                className="signup-oauth signup-oauth-apple"
                onClick={() => handleOAuth("apple")}
              >
                <FaApple className="signup-apple-ico" aria-hidden />
                Continue with Apple
              </button>
              <div className="signup-divider">
                <span>or</span>
              </div>
              <button
                type="button"
                className="signup-btn-submit signup-btn-email"
                onClick={handleContinueEmail}
              >
                Continue with email
                <FiArrowRight />
              </button>
              <p className="signup-login-text">
                Already have an account?
                <span onClick={() => navigate("/login")}> Log In</span>
              </p>
            </div>
          )}

          {/* —— Step 2: Basic information —— */}
          {step === 1 && (
            <form className="signup-form" onSubmit={handleBasicSubmit}>
              <div className="signup-row-2">
                <div className="signup-input">
                  <span className="signup-icon">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    placeholder="First name"
                    value={basic.firstName}
                    onChange={(e) =>
                      setBasic({ ...basic, firstName: e.target.value })
                    }
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="signup-input">
                  <span className="signup-icon">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={basic.lastName}
                    onChange={(e) =>
                      setBasic({ ...basic, lastName: e.target.value })
                    }
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="signup-input">
                <span className="signup-icon">
                  <FiMail />
                </span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={basic.email}
                  onChange={(e) =>
                    setBasic({ ...basic, email: e.target.value })
                  }
                  autoComplete="email"
                  required
                />
              </div>
              {!oauthProvider && (
                <div className="signup-input">
                  <span className="signup-icon">
                    <FiLock />
                  </span>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={basic.password}
                    onChange={(e) =>
                      setBasic({ ...basic, password: e.target.value })
                    }
                    autoComplete="new-password"
                    required
                  />
                </div>
              )}
              {oauthProvider && (
                <p className="signup-oauth-hint">
                  Signed in with {oauthProvider}. You can add a password later in
                  settings.
                </p>
              )}
              <div className="signup-nav-row">
                <button
                  type="button"
                  className="signup-btn-ghost"
                  onClick={goBack}
                >
                  Back
                </button>
                <button type="submit" className="signup-btn-submit signup-btn-inline">
                  Continue
                  <FiArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* —— Step 3: Email verification —— */}
          {step === 2 && (
            <form className="signup-form" onSubmit={handleVerifySubmit}>
              <p className="signup-verify-lead">
                We&apos;ll email a verification code to{" "}
                <strong>{basic.email || "your email"}</strong> once the backend
                is connected. For now, a demo code is filled in — you can continue
                to the next step.
              </p>
              <div className="signup-input">
                <span className="signup-icon">
                  <FiMail />
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="signup-code-input"
                  autoComplete="one-time-code"
                />
              </div>
              <p className="signup-resend">
                <button type="button" className="signup-link-btn">
                  Resend code
                </button>
              </p>
              <div className="signup-nav-row">
                <button
                  type="button"
                  className="signup-btn-ghost"
                  onClick={goBack}
                >
                  Back
                </button>
                <button type="submit" className="signup-btn-submit signup-btn-inline">
                  Verify & continue
                  <FiArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* —— Step 4: Location —— */}
          {step === 3 && (
            <form className="signup-form" onSubmit={handleLocationSubmit}>
              <div className="signup-input">
                <span className="signup-icon">
                  <FiMapPin />
                </span>
                <input
                  type="text"
                  placeholder="Country / Region"
                  value={location.country}
                  onChange={(e) =>
                    setLocation({ ...location, country: e.target.value })
                  }
                  autoComplete="country-name"
                  required
                />
              </div>
              <div className="signup-input">
                <span className="signup-icon">
                  <FiMapPin />
                </span>
                <input
                  type="text"
                  placeholder="City"
                  value={location.city}
                  onChange={(e) =>
                    setLocation({ ...location, city: e.target.value })
                  }
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div className="signup-nav-row">
                <button
                  type="button"
                  className="signup-btn-ghost"
                  onClick={goBack}
                >
                  Back
                </button>
                <button type="submit" className="signup-btn-submit signup-btn-inline">
                  Continue
                  <FiArrowRight />
                </button>
              </div>
            </form>
          )}

          {/* —— Step 5: Professional identity —— */}
          {step === 4 && (
            <form className="signup-form" onSubmit={handleProfessionalSubmit}>
              <div className="signup-identity-pick">
                <span className="signup-identity-label">I am…</span>
                <div className="signup-identity-options">
                  <label className="signup-identity-opt">
                    <input
                      type="radio"
                      name="pro"
                      checked={professional.mode === "employer"}
                      onChange={() =>
                        setProfessional({ ...professional, mode: "employer" })
                      }
                    />
                    Employer
                  </label>
                  <label className="signup-identity-opt">
                    <input
                      type="radio"
                      name="pro"
                      checked={professional.mode === "student"}
                      onChange={() =>
                        setProfessional({ ...professional, mode: "student" })
                      }
                    />
                    Aspirants
                  </label>
                  <label className="signup-identity-opt">
                    <input
                      type="radio"
                      name="pro"
                      checked={professional.mode === "institute"}
                      onChange={() =>
                        setProfessional({
                          ...professional,
                          mode: "institute",
                        })
                      }
                    />
                    Training Institute
                  </label>
                </div>
              </div>

              {professional.mode === "employer" && (
                <>
                  <div className="signup-input">
                    <span className="signup-icon">
                      <FiBriefcase />
                    </span>
                    <input
                      type="text"
                      placeholder="Your role (e.g. Hiring Manager, Founder)"
                      value={professional.jobTitle}
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          jobTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="signup-input">
                    <span className="signup-icon">
                      <FiBriefcase />
                    </span>
                    <input
                      type="text"
                      placeholder="Company / Organization"
                      value={professional.company}
                      onChange={(e) =>
                        setProfessional({
                          ...professional,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {professional.mode === "student" && (
                <p className="signup-oauth-hint">
                  You can add experience and education later in your profile.
                </p>
              )}

              {professional.mode === "institute" && (
                <p className="signup-oauth-hint">
                  Placements and student management continue in the next steps.
                </p>
              )}

              <div className="signup-nav-row">
                <button
                  type="button"
                  className="signup-btn-ghost"
                  onClick={goBack}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="signup-btn-submit signup-btn-inline"
                >
                  Continue
                  <FiArrowRight />
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="signup-robot">
          <img src={robot} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
