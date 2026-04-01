import "./Assessment.css";
import { useCallback, useEffect, useRef, useState } from "react";
import AssessmentDetailsView from "../../components/AssessmentDetailsView/AssessmentDetailsView";
import CreateAssessmentModal from "../../components/CreateAssessment/CreateAssessmentModal";
import {
  deleteInstituteAssessment,
  getInstituteAssessmentById,
  getInstituteAssessments,
} from "../../api/instituteAssessments";
import { FiMoreVertical } from "react-icons/fi";

function formatDateRange(start, end) {
  if (!start && !end) return "Dates not set";
  try {
    const opts = { month: "short", day: "numeric", year: "numeric" };
    const s = start ? new Date(`${start}T12:00:00`) : null;
    const e = end ? new Date(`${end}T12:00:00`) : null;
    if (s && e && !Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime())) {
      return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
    }
    if (s && !Number.isNaN(s.getTime())) return s.toLocaleDateString("en-US", opts);
    return "Dates not set";
  } catch {
    return "Dates not set";
  }
}

function difficultyLabelFromApi(level) {
  if (level == null || level === "") return "Medium";
  const s = String(level);
  return s.charAt(0) + s.slice(1).toLowerCase();
}

/** Maps GET /assessments item to card + details view shape. */
function mapApiAssessmentToUi(row) {
  if (!row || typeof row !== "object") return null;
  const id = row.assessment_id ?? row.id;
  const title = row.assessmentTitle ?? row.title ?? "Untitled";
  const course = row.courseName ?? row.course ?? "—";
  const diff = difficultyLabelFromApi(row.difficultyLevel ?? row.difficulty);
  const subs = row.submissions ?? row.totalSubmission ?? 0;
  const avg = row.averageScorePercent ?? row.averageProgressPercent;
  /** Root-level API `marks` = passing threshold (points), not per-question marks. */
  const passingMarksPoints =
    row.marks != null && String(row.marks).trim() !== "" ? Number(row.marks) : null;

  return {
    ...row,
    id,
    assessment_id: row.assessment_id ?? id,
    title,
    course,
    submissions: subs,
    score: avg != null ? `${avg}%` : "—",
    duration:
      row.timeLimitMinutes != null && row.timeLimitMinutes !== ""
        ? `${row.timeLimitMinutes} min`
        : "No Limit",
    status: row.status ?? "Active",
    batch: row.batch ?? "—",
    dateRangeLabel: formatDateRange(row.startDate, row.endDate),
    difficulty: diff,
    durationMinutes: row.timeLimitMinutes ?? null,
    totalMarks:
      row.totalMarks != null && row.totalMarks !== ""
        ? Number(row.totalMarks)
        : Number(row.marks) || 0,
    totalAttempts: row.attemptLimit ?? 5,
    totalSubmission: subs,
    averageProgressPercent: avg ?? 0,
    aboutText: row.description ?? "",
    passingMarksPoints,
    questions: Array.isArray(row.questions) ? row.questions : [],
  };
}

function normalizeAssessmentsPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.assessments)) return data.assessments;
  return [];
}

function parseListError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    return d.length > 400 ? "Could not load assessments." : d;
  }
  return d?.message || err.message || "Could not load assessments.";
}

function Assessment() {
  const [assessments, setAssessments] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalListItem, setModalListItem] = useState(null);
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const rowMenuRef = useRef(null);

  const loadAssessments = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const { data } = await getInstituteAssessments();
      const raw = normalizeAssessmentsPayload(data);
      setAssessments(raw.map((row) => mapApiAssessmentToUi(row)).filter(Boolean));
    } catch (err) {
      setListError(parseListError(err));
      setAssessments([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  const openCreateModal = useCallback(() => {
    setModalListItem(null);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalListItem(null);
  }, []);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setOpenRowMenu(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleView(item) {
    setOpenRowMenu(null);
    setViewError("");
    if (!item?.id) {
      setViewItem(item);
      return;
    }
    setViewLoading(true);
    setViewItem(null);
    try {
      const { data } = await getInstituteAssessmentById(item.id);
      const raw = data?.data ?? data;
      setViewItem(mapApiAssessmentToUi(raw));
    } catch (err) {
      setViewError(parseListError(err));
      setViewItem(null);
    } finally {
      setViewLoading(false);
    }
  }

  function handleEdit(item) {
    setModalListItem(item);
    setShowModal(true);
    setOpenRowMenu(null);
  }

  async function handleDeleteConfirmed() {
    if (!deleteConfirm?.id) {
      setDeleteError("Missing assessment id.");
      return;
    }
    setDeleteSubmitting(true);
    setDeleteError("");
    try {
      await deleteInstituteAssessment(deleteConfirm.id);
      setDeleteConfirm(null);
      setOpenRowMenu(null);
      await loadAssessments();
    } catch (err) {
      setDeleteError(parseListError(err));
    } finally {
      setDeleteSubmitting(false);
    }
  }

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <div />
        <button type="button" className="create-btn" onClick={openCreateModal}>
          + Create Assessment
        </button>
      </div>

      {listError ? (
        <p className="assessment-list-error" role="alert">
          {listError}
        </p>
      ) : null}

      <div className="assessment-list">
        {listLoading ? (
          <p className="assessment-list-empty">Loading assessments…</p>
        ) : assessments.length === 0 && !listError ? (
          <p className="assessment-list-empty">
            No assessments yet. Create one with &quot;+ Create Assessment&quot;.
          </p>
        ) : null}
        {!listLoading &&
          assessments.map((item, index) => (
          <div
            key={item.id != null ? String(item.id) : `${item.title}-${index}`}
            className="assessment-card"
          >
            <div className="assessment-left">
              <h3>{item.title}</h3>
              <p>{item.course}</p>
            </div>

            <div className="assessment-stats">
              <div>
                <h4>{item.submissions}</h4>
                <span>Submissions</span>
              </div>
              <div>
                <h4>{item.score}</h4>
                <span>Average Score</span>
              </div>
              <div>
                <h4>{item.duration}</h4>
                <span>Duration</span>
              </div>
            </div>

            <div className="assessment-right">
              <span
                className={item.status === "Active" ? "status active" : "status draft"}
              >
                {item.status}
              </span>

              <div
                className="assessment-row-menu"
                ref={openRowMenu === index ? rowMenuRef : null}
              >
                <button
                  type="button"
                  className="assessment-row-menu-btn"
                  aria-expanded={openRowMenu === index}
                  aria-label="Assessment actions"
                  onClick={() =>
                    setOpenRowMenu(openRowMenu === index ? null : index)
                  }
                >
                  <FiMoreVertical />
                </button>
                {openRowMenu === index && (
                  <div className="assessment-row-dropdown">
                    <button type="button" onClick={() => handleView(item)}>
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={item.id == null}
                      onClick={() => {
                        if (item.id == null) return;
                        setDeleteError("");
                        setDeleteConfirm({
                          id: String(item.id),
                          title: item.title,
                        });
                        setOpenRowMenu(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CreateAssessmentModal
          close={closeModal}
          listItem={modalListItem}
          onSuccess={loadAssessments}
        />
      )}

      {viewLoading ? (
        <div
          className="assessment-view-overlay"
          role="alert"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="assessment-detail-loading">Loading assessment…</div>
        </div>
      ) : null}

      {viewError && !viewLoading ? (
        <div
          className="assessment-view-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assessment-view-error-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewError("");
          }}
        >
          <div className="assessment-delete-modal">
            <h3 id="assessment-view-error-title">Could not load assessment</h3>
            <p className="assessment-view-error-text" role="alert">
              {viewError}
            </p>
            <div className="assessment-delete-actions">
              <button
                type="button"
                className="assessment-delete-confirm"
                onClick={() => setViewError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {viewItem && !viewLoading ? (
        <AssessmentDetailsView
          item={viewItem}
          onBack={() => {
            setViewItem(null);
            setViewError("");
          }}
        />
      ) : null}

      {deleteConfirm ? (
        <div
          className="assessment-view-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSubmitting) {
              setDeleteConfirm(null);
              setDeleteError("");
            }
          }}
        >
          <div className="assessment-delete-modal">
            <h3>Delete assessment</h3>
            <p>
              Remove <strong>{deleteConfirm.title}</strong>? This cannot be undone.
            </p>
            {deleteError ? (
              <p className="assessment-list-error" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="assessment-delete-actions">
              <button
                type="button"
                className="assessment-delete-cancel"
                disabled={deleteSubmitting}
                onClick={() => {
                  if (!deleteSubmitting) {
                    setDeleteConfirm(null);
                    setDeleteError("");
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="assessment-delete-confirm"
                disabled={deleteSubmitting}
                onClick={handleDeleteConfirmed}
              >
                {deleteSubmitting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Assessment;
