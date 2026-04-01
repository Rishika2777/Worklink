import React from "react";
import "./AssessmentDetailsView.css";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export default function AssessmentDetailsView({ item, onClose, onBack }) {
  const close = onClose ?? onBack;
  if (!item) return null;

  const title = item.assessmentTitle || item.title || "Assessment";
  const courseLabel = item.courseName || item.course || "—";
  const passingMarks =
    item.passingMarksPoints != null
      ? item.passingMarksPoints
      : item.marks != null && typeof item.marks === "number"
        ? item.marks
        : item.marks;
  const questions = Array.isArray(item.questions) ? item.questions : [];
  const totalMarks = item.totalMarks != null ? item.totalMarks : "—";

  return (
    <div className="assessment-details-overlay" onClick={close} role="presentation">
      <div
        className="assessment-details-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-details-title"
      >
        <div className="assessment-details-hero">
          <div className="assessment-details-hero-text">
            <p className="assessment-details-eyebrow">Assessment</p>
            <h2 id="assessment-details-title">{title}</h2>
            <p className="assessment-details-meta">
              <span>{item.batch || "—"}</span>
              <span className="assessment-details-meta-sep">•</span>
              <span>{item.dateRangeLabel || "—"}</span>
              {item.difficultyLevel || item.difficulty ? (
                <>
                  <span className="assessment-details-meta-sep">•</span>
                  <span className="assessment-details-difficulty-pill">
                    {item.difficultyLevel || item.difficulty}
                  </span>
                </>
              ) : null}
            </p>
          </div>
          <button type="button" className="assessment-details-close" onClick={close} aria-label="Close">
            ×
          </button>
        </div>

        <div className="assessment-details-body">
          <section className="assessment-details-section">
            <h3 className="assessment-details-section-title">Details</h3>
            <dl className="assessment-details-dl">
              <div>
                <dt>Assessment ID</dt>
                <dd>{item.assessment_id || item.id || "—"}</dd>
              </div>
              <div>
                <dt>Course ID</dt>
                <dd>{item.courseId ?? "—"}</dd>
              </div>
              <div>
                <dt>Course name</dt>
                <dd>{courseLabel}</dd>
              </div>
              <div>
                <dt>Time limit</dt>
                <dd>
                  {item.durationMinutes != null
                    ? `${item.durationMinutes} min`
                    : item.duration || "—"}
                </dd>
              </div>
              <div>
                <dt>Total marks</dt>
                <dd>{totalMarks}</dd>
              </div>
              <div>
                <dt>Passing marks</dt>
                <dd>{passingMarks != null && passingMarks !== "" ? passingMarks : "—"}</dd>
              </div>
              <div>
                <dt>Attempt limit</dt>
                <dd>{item.totalAttempts ?? item.attemptLimit ?? "—"}</dd>
              </div>
              <div>
                <dt>Start date</dt>
                <dd>{formatDate(item.startDate)}</dd>
              </div>
              <div>
                <dt>End date</dt>
                <dd>{formatDate(item.endDate)}</dd>
              </div>
            </dl>
          </section>

          {(item.aboutText || item.description) && (
            <section className="assessment-details-section">
              <h3 className="assessment-details-section-title">Instructions / description</h3>
              <p className="assessment-details-description">{item.aboutText || item.description}</p>
            </section>
          )}

          <section className="assessment-details-section">
            <h3 className="assessment-details-section-title">
              Questions
              <span className="assessment-details-count">({questions.length})</span>
            </h3>
            {questions.length === 0 ? (
              <p className="assessment-details-empty">No questions in this assessment.</p>
            ) : (
              <ul className="assessment-details-questions">
                {questions.map((q, idx) => (
                  <li key={idx} className="assessment-details-question-card">
                    <div className="assessment-details-question-head">
                      <span className="assessment-details-q-num">Q{idx + 1}</span>
                      {q.marks != null ? (
                        <span className="assessment-details-q-marks">{q.marks} pts</span>
                      ) : null}
                    </div>
                    <p className="assessment-details-q-text">{q.questionText || "—"}</p>
                    <ul className="assessment-details-options">
                      {["A", "B", "C", "D"].map((letter) => {
                        const key = `option${letter}`;
                        const text = q[key];
                        if (text == null || text === "") return null;
                        const isCorrect = (q.correctOption || "").toUpperCase() === letter;
                        return (
                          <li
                            key={letter}
                            className={
                              isCorrect
                                ? "assessment-details-option assessment-details-option--correct"
                                : "assessment-details-option"
                            }
                          >
                            <span className="assessment-details-option-letter">{letter}.</span>
                            <span>{text}</span>
                            {isCorrect ? (
                              <span className="assessment-details-correct-badge">Correct</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="assessment-details-section assessment-details-stats-row">
            <div className="assessment-details-stat">
              <p className="assessment-details-stat-label">Submissions</p>
              <p className="assessment-details-stat-value">{item.totalSubmission ?? item.submissions ?? 0}</p>
            </div>
            <div className="assessment-details-stat">
              <p className="assessment-details-stat-label">Average score</p>
              <p className="assessment-details-stat-value">{item.score ?? "—"}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
