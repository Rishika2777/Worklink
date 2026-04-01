import "../Auth/signup.css";
import "./OnboardingShell.css";
import robot from "../../assets/images/robot-login.png";
import { FiArrowRight } from "react-icons/fi";

function OnboardingShell({
  roleLabel,
  currentStepIndex,
  totalInnerSteps = 6,
  globalStepStart = 7,
  stepTitle,
  stepSubtitle,
  children,
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Continue",
  isLastStep = false,
}) {
  const displayStep = globalStepStart + currentStepIndex;
  const progressPct = (displayStep / 12) * 100;

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-form-area signup-wizard">
          <span className="signup-badge">Get started</span>
          {roleLabel ? (
            <p className="ob-signup-role-hint">{roleLabel}</p>
          ) : null}
          <div className="signup-step-meta" aria-live="polite">
            Step {displayStep} of 12
          </div>
          <div className="signup-progress-track" aria-hidden>
            <div
              className="signup-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {stepTitle ? (
            <h2 className="signup-heading">{stepTitle}</h2>
          ) : null}
          {stepSubtitle ? (
            <p className="signup-subtext">{stepSubtitle}</p>
          ) : null}

          <div className="signup-onboarding-panel">{children}</div>

          <div className="signup-nav-row signup-onboarding-nav">
            {currentStepIndex > 0 ? (
              <button
                type="button"
                className="signup-btn-ghost"
                onClick={onBack}
              >
                Back
              </button>
            ) : (
              <span className="ob-footer-spacer" />
            )}
            <button
              type="button"
              className="signup-btn-submit signup-btn-inline"
              onClick={onNext}
              disabled={nextDisabled}
            >
              {isLastStep ? "Go to dashboard" : nextLabel}
              {!isLastStep && <FiArrowRight />}
            </button>
          </div>
        </div>
        <div className="signup-robot">
          <img src={robot} alt="" />
        </div>
      </div>
    </div>
  );
}

export default OnboardingShell;
