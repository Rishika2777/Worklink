import React from "react";
import "./authFlowTheme.css";
import "./GoogleAccountChooser.css";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiUser } from "react-icons/fi";
import { AuthFlowStepIndicator } from "./AuthFlowStepIndicator";

const ACCOUNTS = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe88@gmail.com",
    initials: "JD",
    avatarBg: "#7c3aed",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "janesmith80@gmail.com",
    initials: "JS",
    avatarBg: "#4d5c3a",
  },
];

function GoogleAccountChooser() {
  const navigate = useNavigate();

  function goVerify(account) {
    navigate("/login/verify-email", {
      state: {
        email: account.email,
        displayName: account.name,
      },
    });
  }

  return (
    <div className="auth-flow-page">
      <div className="auth-flow-shell">
        <AuthFlowStepIndicator activeIndex={0} />

        <div className="auth-flow-card google-chooser-card">
          <div className="google-chooser-brand">
            <span className="google-chooser-g-logo" aria-hidden>
              G
            </span>
          </div>

          <h1 className="google-chooser-title">Choose an account</h1>
          <p className="google-chooser-subtitle">to continue to WorkLink</p>

          <div className="google-chooser-list" role="list">
            {ACCOUNTS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="google-chooser-row"
                role="listitem"
                onClick={() => goVerify(a)}
              >
                <span
                  className="google-chooser-avatar"
                  style={{ background: a.avatarBg }}
                >
                  {a.initials}
                </span>
                <span className="google-chooser-row-text">
                  <span className="google-chooser-name">{a.name}</span>
                  <span className="google-chooser-email">{a.email}</span>
                </span>
                <FiChevronRight className="google-chooser-chevron" aria-hidden />
              </button>
            ))}

            <button
              type="button"
              className="google-chooser-row google-chooser-row--another"
              onClick={() => navigate("/login")}
            >
              <span className="google-chooser-avatar google-chooser-avatar--outline">
                <FiUser aria-hidden />
              </span>
              <span className="google-chooser-another-text">Use another account</span>
            </button>
          </div>

          <button
            type="button"
            className="google-chooser-back"
            onClick={() => navigate("/login")}
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoogleAccountChooser;
