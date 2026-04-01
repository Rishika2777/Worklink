import React, { useRef, useState } from "react";
import "./authFlowTheme.css";
import "./VerifyEmailOtp.css";
import { useLocation, useNavigate } from "react-router-dom";
import { IoShieldCheckmark } from "react-icons/io5";
import { AuthFlowStepIndicator } from "./AuthFlowStepIndicator";

const OTP_LEN = 6;
/** Demo default code so user can continue without typing (replace when API exists). */
const DEFAULT_OTP = "123456";

function VerifyEmailOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState =
    location.state?.email || "johndoe88@gmail.com";

  const [digits, setDigits] = useState(() =>
    DEFAULT_OTP.split("").slice(0, OTP_LEN)
  );
  const inputsRef = useRef([]);

  function setDigitAt(index, value) {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < OTP_LEN - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!text) return;
    e.preventDefault();
    const next = text.split("");
    while (next.length < OTP_LEN) next.push("");
    setDigits(next);
    const focusIdx = Math.min(text.length, OTP_LEN - 1);
    inputsRef.current[focusIdx]?.focus();
  }

  const code = digits.join("");
  const isComplete = code.length === OTP_LEN && /^\d{6}$/.test(code);

  function handleVerify() {
    if (!isComplete) return;
    navigate("/onboarding");
  }

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-shell">
        <AuthFlowStepIndicator activeIndex={1} />

        <div className="auth-flow-card verify-email-card">
          <div className="verify-email-icon-wrap" aria-hidden>
            <IoShieldCheckmark className="verify-email-shield" />
          </div>

          <h1 className="verify-email-title">Verify your email</h1>
          <p className="verify-email-lead">
            We&apos;ve sent a 6-digit code to{" "}
            <strong className="verify-email-strong">{emailFromState}</strong>
          </p>

          <div
            className="verify-email-otp-row"
            onPaste={handlePaste}
            role="group"
            aria-label="Enter 6-digit verification code"
          >
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                {i === 3 && (
                  <span className="verify-email-otp-plus" aria-hidden>
                    +
                  </span>
                )}
                <input
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  className="verify-email-otp-cell"
                  value={d}
                  onChange={(e) => setDigitAt(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                />
              </React.Fragment>
            ))}
          </div>

          <button type="button" className="verify-email-resend">
            Resend Verification Code
          </button>

          <button
            type="button"
            className="verify-email-submit"
            disabled={!isComplete}
            onClick={handleVerify}
          >
            Verify &amp; Continue
          </button>

          <button
            type="button"
            className="verify-email-back"
            onClick={() => navigate("/login/google")}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailOtp;
