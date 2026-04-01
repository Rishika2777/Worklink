import React from "react";

/**
 * 4 steps: activeIndex 0–3 maps pill position (0 = first).
 * mode="dotsOnly" — four light dots (e.g. Reset Password screen).
 */
export function AuthFlowStepIndicator({ activeIndex = 0, mode = "default" }) {
  if (mode === "dotsOnly") {
    return (
      <div className="auth-flow-step-indicator" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="auth-flow-step-dot" />
        ))}
      </div>
    );
  }

  return (
    <div className="auth-flow-step-indicator" aria-hidden="true">
      {[0, 1, 2, 3].map((i) =>
        i === activeIndex ? (
          <span
            key={i}
            className="auth-flow-step-pill auth-flow-step-pill--active"
          />
        ) : (
          <span key={i} className="auth-flow-step-dot" />
        )
      )}
    </div>
  );
}
