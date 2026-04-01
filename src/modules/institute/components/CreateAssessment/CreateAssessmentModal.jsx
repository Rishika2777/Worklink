import "./CreateAssessmentModal.css";
import {
  FiBookOpen,
  FiCalendar,
  FiHelpCircle,
  FiLayers,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createInstituteAssessment,
  getInstituteAssessmentById,
  updateInstituteAssessment,
} from "../../api/instituteAssessments";
import {
  getInstituteCourseRecordId,
  getInstituteCourses,
} from "../../api/instituteCourses";
import {
  buildCreateAssessmentRequestBody,
  mapAssessmentApiResponseToModalForm,
} from "../../utils/assessmentApiPayload";

function normalizeCoursesPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.courses)) return data.courses;
  return [];
}

/** Titles from GET /courses — POST assessments expects exact `courseName` string. */
function courseTitlesFromApi(courses) {
  const titles = (courses || [])
    .map((c) => String(c?.courseTitle ?? "").trim())
    .filter(Boolean);
  return [...new Set(titles)];
}

const BATCHES = ["Batch Jan 2026", "Batch Feb 2026", "Batch Mar 2026", "B.23A", "B.24A"];

const DIFFICULTY = [
  { value: "easy", label: "Easy", dot: "#22c55e" },
  { value: "medium", label: "Medium", dot: "#f97316" },
  { value: "hard", label: "Hard", dot: "#ef4444" },
];

const ATTEMPT_OPTIONS = ["1 Attempt", "2 Attempts", "3 Attempts", "5 Attempts", "Unlimited"];

function genQuestionId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function newMcqQuestion(id) {
  return {
    id,
    kind: "mcq",
    prompt: "",
    marks: 1,
    options: [
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "" },
    ],
    correctIndex: 0,
  };
}

function parseAssessmentApiError(err) {
  const status = err.response?.status;
  if (status === 500) {
    return (
      "Server error while saving. Ensure total marks equals the sum of all question marks, " +
      "the course is selected from your catalog, and try again."
    );
  }
  const d = err.response?.data;
  if (typeof d === "string") {
    const low = d.toLowerCase();
    if (low.includes("err_ngrok_3200") || low.includes("is offline")) {
      return "API tunnel is offline. Check your backend and proxy.";
    }
    return d.length > 400 ? "Unexpected server response." : d;
  }
  return (
    d?.message ||
    d?.error ||
    (Array.isArray(d?.errors) && d.errors.join(", ")) ||
    err.message ||
    "Could not save assessment."
  );
}

function CreateAssessmentModal({ close, onPublish, onSuccess, listItem }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [description, setDescription] = useState("");

  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [totalMarks, setTotalMarks] = useState(100);
  const [difficulty, setDifficulty] = useState("medium");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attemptLimit, setAttemptLimit] = useState("5 Attempts");

  const [questions, setQuestions] = useState(() => [newMcqQuestion(genQuestionId())]);

  const [passingMarksPercent, setPassingMarksPercent] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  const [courseTitles, setCourseTitles] = useState([]);
  const [courseTitleToId, setCourseTitleToId] = useState(() => new Map());
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  /** courseId from GET assessment (for PUT) or resolved from catalog by title */
  const [assessmentCourseId, setAssessmentCourseId] = useState(null);

  const questionsTotalMarks = useMemo(
    () => questions.reduce((s, q) => s + (Number(q.marks) || 0), 0),
    [questions]
  );

  const isEditMode = Boolean(listItem);
  const isFetchEdit = Boolean(listItem?.id);
  const showForm = !isFetchEdit || (!loadLoading && !loadFailed);

  function dismissToast() {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(null);
  }

  function showToast(msg) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 8000);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCoursesLoading(true);
    setCoursesError("");
    getInstituteCourses()
      .then(({ data }) => {
        if (cancelled) return;
        const raw = normalizeCoursesPayload(data);
        setCourseTitles(courseTitlesFromApi(raw));
        const m = new Map();
        raw.forEach((c) => {
          const t = String(c?.courseTitle ?? "").trim();
          const id = getInstituteCourseRecordId(c);
          if (t && id) m.set(t, id);
        });
        setCourseTitleToId(m);
      })
      .catch((err) => {
        if (cancelled) return;
        const d = err.response?.data;
        const msg =
          typeof d === "string"
            ? d
            : d?.message || err.message || "Could not load courses.";
        setCoursesError(msg);
        setCourseTitles([]);
      })
      .finally(() => {
        if (!cancelled) setCoursesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!listItem) setAssessmentCourseId(null);
  }, [listItem]);

  useEffect(() => {
    if (!listItem) return;
    setLoadFailed(false);

    if (!listItem.id) {
      setLoadLoading(false);
      setTitle(listItem.title || "");
      const c = listItem.course;
      if (c) setCourse(String(c));
      return;
    }

    let cancelled = false;
    setLoadLoading(true);
    setLoadFailed(false);
    getInstituteAssessmentById(listItem.id)
      .then(({ data }) => {
        if (cancelled) return;
        const raw = data?.data ?? data;
        if (!raw || typeof raw !== "object") {
          setLoadFailed(true);
          showToast("Invalid assessment data from server.");
          setLoadLoading(false);
          return;
        }
        const form = mapAssessmentApiResponseToModalForm(raw, genQuestionId);
        setAssessmentCourseId(
          raw.courseId != null && String(raw.courseId).trim() !== ""
            ? String(raw.courseId).trim()
            : null
        );
        setTitle(form.title);
        setCourse(form.course || "");
        setBatch(form.batch);
        setDescription(form.description);
        setTimeLimitMinutes(form.timeLimitMinutes);
        setDifficulty(form.difficulty);
        setStartDate(form.startDate);
        setEndDate(form.endDate);
        setAttemptLimit(form.attemptLimit);
        setPassingMarksPercent(
          form.passingMarksPercent != null ? form.passingMarksPercent : 50
        );
        const qs = form.questions.length
          ? form.questions
          : [newMcqQuestion(genQuestionId())];
        const qSum = qs.reduce(
          (s, q) => s + Math.max(1, Number(q.marks) || 0),
          0
        );
        setTotalMarks(
          qSum > 0 && qSum !== form.totalMarks ? qSum : Math.max(1, form.totalMarks || 1)
        );
        setQuestions(qs);
        setLoadLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadFailed(true);
        showToast(parseAssessmentApiError(err));
        setLoadLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listItem]);

  const addMcq = useCallback(() => {
    setQuestions((prev) => [...prev, newMcqQuestion(genQuestionId())]);
  }, []);

  const addAnotherQuestion = addMcq;

  const removeQuestion = useCallback((index) => {
    setQuestions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateQuestion = useCallback((index, patch) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q))
    );
  }, []);

  const updateOption = useCallback((qIndex, optIndex, text) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = q.options.map((o, j) =>
          j === optIndex ? { ...o, text } : o
        );
        return { ...q, options };
      })
    );
  }, []);

  async function handlePublish(e) {
    e.preventDefault();

    if (isEditMode && !listItem?.id) {
      showToast("This assessment cannot be updated. Open it from the list.");
      return;
    }

    if (!title.trim()) {
      showToast("Please enter an assessment title.");
      return;
    }
    if (!course.trim()) {
      showToast("Please select a course from the list.");
      return;
    }
    if (courseTitles.length > 0 && !courseTitles.includes(course.trim())) {
      showToast("Selected course is not in your catalog. Pick a course from the dropdown.");
      return;
    }
    if (!batch) {
      showToast("Please select a batch.");
      return;
    }
    if (!startDate || !endDate) {
      showToast("Please set start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      showToast("End date must be on or after start date.");
      return;
    }

    const sumQuestionMarks = questions.reduce(
      (s, q) => s + Math.max(1, Number(q.marks) || 0),
      0
    );
    const tm = Math.max(1, Number(totalMarks) || 1);
    if (sumQuestionMarks !== tm) {
      showToast(
        `Total marks (${tm}) must equal the sum of question marks (${sumQuestionMarks}). Update "Total Marks" or each question's marks so they match.`
      );
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt.trim()) {
        showToast(`Please enter text for question ${i + 1}.`);
        return;
      }
      const emptyOpt = q.options.some((o) => !o.text.trim());
      if (emptyOpt) {
        showToast(`Please fill all options for question ${i + 1}.`);
        return;
      }
    }

    const courseIdResolved =
      courseTitleToId.get(course.trim()) ?? assessmentCourseId ?? undefined;

    const payload = {
      title: title.trim(),
      course: course.trim(),
      courseId: courseIdResolved,
      batch,
      description: description.trim(),
      timeLimitMinutes,
      totalMarks: tm,
      difficulty,
      startDate,
      endDate,
      attemptLimit,
      questions,
      passingMarksPercent,
    };

    const body = buildCreateAssessmentRequestBody(payload);

    setSubmitting(true);
    try {
      if (listItem?.id) {
        await updateInstituteAssessment(listItem.id, body);
      } else {
        await createInstituteAssessment(body);
      }
      if (typeof onPublish === "function") {
        onPublish(payload);
      }
      if (typeof onSuccess === "function") {
        onSuccess();
      }
      close();
      navigate("/institute-dashboard/assessment", { replace: true });
    } catch (err) {
      showToast(parseAssessmentApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
    <div
      className="create-assessment-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-assessment-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="create-assessment-shell"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="create-assessment-topbar">
          <h1 id="create-assessment-title" className="create-assessment-title">
            {isEditMode ? "Edit Assessment" : "Create Assessment"}
          </h1>
          <button type="button" className="create-assessment-cancel-link" onClick={close}>
            Cancel
          </button>
        </header>

        <form className="create-assessment-form" onSubmit={handlePublish}>
          {loadLoading && isFetchEdit ? (
            <p className="create-assessment-loading" role="status">
              Loading assessment…
            </p>
          ) : null}

          {showForm ? (
            <>
          <section className="ca-card">
            <div className="ca-card-head">
              <span className="ca-card-icon" aria-hidden>
                <FiBookOpen />
              </span>
              <div>
                <h2 className="ca-card-title">Assessment Info</h2>
                <p className="ca-card-sub">Basic details about your assessment.</p>
              </div>
            </div>

            <label className="ca-label">Assessment Title</label>
            <input
              className="ca-input"
              placeholder="Jitter Animation Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="ca-row-2">
              <div>
                <label className="ca-label">Course</label>
                <select
                  className="ca-input"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  disabled={coursesLoading}
                  aria-busy={coursesLoading}
                >
                  <option value="">
                    {coursesLoading ? "Loading courses…" : "Select a course"}
                  </option>
                  {courseTitles.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {course &&
                  !courseTitles.includes(course) &&
                  course.trim() !== "" ? (
                    <option value={course}>{course} (not in catalog)</option>
                  ) : null}
                </select>
                {coursesError ? (
                  <p className="ca-field-hint ca-field-hint--error" role="alert">
                    {coursesError} Add courses in Course Management first.
                  </p>
                ) : null}
                {!coursesLoading && !coursesError && courseTitles.length === 0 ? (
                  <p className="ca-field-hint">
                    No courses yet. Add a course under Course Management, then create an
                    assessment.
                  </p>
                ) : null}
              </div>
              <div>
                <label className="ca-label">Batch</label>
                <select
                  className="ca-input"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option value="">Select Batch</option>
                  {BATCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  {batch && !BATCHES.includes(batch) ? (
                    <option value={batch}>{batch}</option>
                  ) : null}
                </select>
              </div>
            </div>

            <label className="ca-label">Description</label>
            <textarea
              className="ca-textarea"
              rows={4}
              placeholder="Enter instructions for students."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

          <section className="ca-card">
            <div className="ca-card-head">
              <span className="ca-card-icon" aria-hidden>
                <FiLayers />
              </span>
              <div>
                <h2 className="ca-card-title">Add Assessment Details</h2>
                <p className="ca-card-sub">Configure time, marks and availability.</p>
              </div>
            </div>

            <div className="ca-row-2">
              <div>
                <label className="ca-label">Time Limit (minutes)</label>
                <input
                  className="ca-input"
                  type="number"
                  min={1}
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="ca-label">Total Marks</label>
                <input
                  className="ca-input"
                  type="number"
                  min={1}
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="ca-row-2">
              <div>
                <label className="ca-label">Difficulty Level</label>
                <select
                  className="ca-input ca-select-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {DIFFICULTY.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ca-label">Attempt Limit</label>
                <select
                  className="ca-input"
                  value={attemptLimit}
                  onChange={(e) => setAttemptLimit(e.target.value)}
                >
                  {ATTEMPT_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                  {attemptLimit && !ATTEMPT_OPTIONS.includes(attemptLimit) ? (
                    <option value={attemptLimit}>{attemptLimit}</option>
                  ) : null}
                </select>
              </div>
            </div>

            <div className="ca-row-2">
              <div>
                <label className="ca-label">Start Date</label>
                <div className="ca-input-wrap">
                  <FiCalendar className="ca-input-icon" />
                  <input
                    className="ca-input ca-input-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="ca-label">End Date</label>
                <div className="ca-input-wrap">
                  <FiCalendar className="ca-input-icon" />
                  <input
                    className="ca-input ca-input-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="ca-card ca-card-questions">
            <div className="ca-questions-head">
              <div className="ca-card-head ca-card-head-inline">
                <span className="ca-card-icon" aria-hidden>
                  <FiHelpCircle />
                </span>
                <div>
                  <h2 className="ca-card-title">Questions</h2>
                  <p className="ca-questions-summary">
                    {questions.length} Question{questions.length !== 1 ? "s" : ""} ·{" "}
                    {questionsTotalMarks} Total Marks
                  </p>
                </div>
              </div>
            </div>

            <div className="ca-questions-toolbar">
              <button type="button" className="ca-btn-mcq ca-btn-mcq-bar" onClick={addMcq}>
                <FiPlus /> MCQ
              </button>
            </div>

            <ul className="ca-question-list">
              {questions.map((q, qi) => (
                <li key={q.id} className="ca-question-block">
                  <div className="ca-question-toolbar">
                    <span className="ca-drag" aria-hidden title="Reorder (visual)">
                      ⋮⋮
                    </span>
                    <span className="ca-tag">Multiple Choice</span>
                    <label className="ca-marks-inline">
                      <input
                        type="number"
                        min={1}
                        className="ca-marks-input"
                        value={q.marks}
                        onChange={(e) =>
                          updateQuestion(qi, { marks: Number(e.target.value) || 1 })
                        }
                      />
                      <span>marks</span>
                    </label>
                    <button
                      type="button"
                      className="ca-q-delete"
                      aria-label="Remove question"
                      disabled={questions.length <= 1}
                      onClick={() => removeQuestion(qi)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <textarea
                    className="ca-textarea ca-q-prompt"
                    placeholder="Enter Your Question here...."
                    value={q.prompt}
                    onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                  />
                  <div className="ca-options">
                    {["A", "B", "C", "D"].map((letter, oi) => (
                      <label key={letter} className="ca-option-row">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateQuestion(qi, { correctIndex: oi })}
                        />
                        <span className="ca-option-label">Option {letter}</span>
                        <input
                          type="text"
                          className="ca-input ca-option-input"
                          placeholder={`Option ${letter}`}
                          value={q.options[oi]?.text ?? ""}
                          onChange={(e) => updateOption(qi, oi, e.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <button type="button" className="ca-add-another" onClick={addAnotherQuestion}>
              <FiPlus /> Add Another Question
            </button>
          </section>

          <section className="ca-card ca-card-passing">
            <label className="ca-label ca-label-passing">
              <span className="ca-pass-dot" aria-hidden />
              Passing Marks %
            </label>
            <input
              className="ca-input ca-input-passing"
              type="number"
              min={0}
              max={100}
              value={passingMarksPercent}
              onChange={(e) => setPassingMarksPercent(Number(e.target.value) || 0)}
            />
          </section>

          <footer className="create-assessment-footer">
            <button
              type="submit"
              className="create-assessment-publish"
              disabled={
                submitting ||
                (!isFetchEdit &&
                  (coursesLoading ||
                    Boolean(coursesError) ||
                    courseTitles.length === 0))
              }
            >
              {submitting
                ? isEditMode
                  ? "Saving…"
                  : "Publishing…"
                : isEditMode
                  ? "Save changes"
                  : "Publish Assessment"}
            </button>
          </footer>
            </>
          ) : null}
        </form>
      </div>
    </div>

    {toastMessage
      ? createPortal(
          <div className="ca-toast-overlay" role="presentation">
            <div className="ca-toast" role="alert" aria-live="assertive">
              <p className="ca-toast-text">{toastMessage}</p>
              <button
                type="button"
                className="ca-toast-dismiss"
                onClick={dismissToast}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>,
          document.body
        )
      : null}
    </>
  );
}

export default CreateAssessmentModal;
