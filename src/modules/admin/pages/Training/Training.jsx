import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import {
  createAdminTraining,
  deleteAdminTraining,
  getAdminTrainings,
  updateAdminTraining,
} from "../../api/adminTrainings";
import AdminTablePagination, {
  ADMIN_TABLE_PAGE_SIZE,
} from "../../components/AdminTablePagination";
import "../../styles/AdminPanel.css";
import "../../styles/AdminSectionLayout.css";

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const emptyForm = () => ({
  programName: "",
  trainer: "",
  category: "",
  duration: "",
  capacity: "",
  startDate: "",
  schedule: "",
});

function formatStartDateForTable(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** YYYY-MM-DD for date input */
function startDateValueForInput(raw) {
  if (raw == null || raw === "") return "";
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mapApiTrainingToRow(data, index = 0) {
  if (!data || typeof data !== "object") return null;
  const fallbackId = `local-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const sid =
    data.id != null && data.id !== "" ? String(data.id) : fallbackId;
  return {
    id: sid,
    program: data.programName ?? "",
    trainer: data.trainer ?? "",
    category: data.category ?? "",
    duration: data.duration ?? "",
    startDate: formatStartDateForTable(data.startDate),
    startDateIso: startDateValueForInput(data.startDate),
    schedule: data.schedule ?? "",
    enrolled: Number(data.enrolled ?? data.enrollmentCount ?? 0) || 0,
    capacity: Number(data.capacity) || 0,
    status: data.status ?? "In Progress",
  };
}

function rowToTrainingForm(row) {
  return {
    programName: row.program ?? "",
    trainer: row.trainer ?? "",
    category: row.category ?? "",
    duration: row.duration ?? "",
    capacity: row.capacity != null ? String(row.capacity) : "",
    startDate: row.startDateIso ?? "",
    schedule: row.schedule ?? "",
  };
}

function trainingRowHasServerId(row) {
  return row?.id != null && !String(row.id).startsWith("local-");
}

function validateTrainingForm(form) {
  const capacityNum = parseInt(String(form.capacity).trim(), 10);
  if (Number.isNaN(capacityNum) || capacityNum < 1) {
    return { ok: false, error: "Please enter a valid capacity (number ≥ 1)." };
  }
  if (!form.duration) {
    return { ok: false, error: "Please select a duration." };
  }
  return {
    ok: true,
    payload: {
      programName: form.programName.trim(),
      trainer: form.trainer.trim(),
      category: (form.category || "").trim(),
      duration: form.duration,
      capacity: capacityNum,
      startDate: form.startDate,
      schedule: (form.schedule || "").trim(),
    },
  };
}

function normalizeTrainingsPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.trainings)) return data.trainings;
  return [];
}

function parseTrainingApiError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    const low = d.toLowerCase();
    if (low.includes("err_ngrok_3200") || low.includes("is offline")) {
      return "API tunnel is offline (ngrok). Start your backend, run ngrok, and if the URL changed update vite.config.js proxy target.";
    }
    if (d.trimStart().startsWith("<!") || low.includes("ngrok")) {
      return "Got a web page instead of JSON—usually ngrok is down or the proxy URL is wrong. Fix the tunnel, then restart the dev server.";
    }
    return d.length > 400
      ? "Unexpected server response. Open DevTools → Network → trainings → Response."
      : d;
  }
  return (
    d?.message ||
    d?.error ||
    (Array.isArray(d?.errors) && d.errors.join(", ")) ||
    err.message ||
    "Invalid request or server error."
  );
}

function Training() {
  const [programs, setPrograms] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showCreateTrainingModal, setShowCreateTrainingModal] = useState(false);
  const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [listPage, setListPage] = useState(1);
  const rowMenuRef = useRef(null);

  const loadTrainings = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const { data } = await getAdminTrainings();
      const list = normalizeTrainingsPayload(data);
      setPrograms(
        list.map((item, index) => mapApiTrainingToRow(item, index)).filter(Boolean)
      );
    } catch (err) {
      setListError(parseTrainingApiError(err));
      setPrograms([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(programs.length / ADMIN_TABLE_PAGE_SIZE));
    setListPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [programs.length]);

  const pagedPrograms = useMemo(() => {
    const start = (listPage - 1) * ADMIN_TABLE_PAGE_SIZE;
    return programs.slice(start, start + ADMIN_TABLE_PAGE_SIZE);
  }, [programs, listPage]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setOpenRowMenu(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (showCreateTrainingModal) {
      setForm(emptyForm());
      setSubmitError("");
      setSubmitLoading(false);
      setShowEditTrainingModal(false);
      setEditingTrainingId(null);
    }
  }, [showCreateTrainingModal]);

  function closeTrainingFormModal() {
    setShowCreateTrainingModal(false);
    setShowEditTrainingModal(false);
    setEditingTrainingId(null);
    setSubmitError("");
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const parsed = validateTrainingForm(form);
    if (!parsed.ok) {
      setSubmitError(parsed.error);
      return;
    }

    setSubmitLoading(true);
    try {
      await createAdminTraining(parsed.payload);
      closeTrainingFormModal();
      await loadTrainings();
    } catch (err) {
      setSubmitError(parseTrainingApiError(err));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleEditTrainingSubmit(e) {
    e.preventDefault();
    if (!editingTrainingId) return;
    setSubmitError("");
    const parsed = validateTrainingForm(form);
    if (!parsed.ok) {
      setSubmitError(parsed.error);
      return;
    }

    setSubmitLoading(true);
    try {
      await updateAdminTraining(editingTrainingId, parsed.payload);
      closeTrainingFormModal();
      await loadTrainings();
    } catch (err) {
      setSubmitError(parseTrainingApiError(err));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleConfirmDeleteTraining() {
    if (!deleteConfirm?.id) return;
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAdminTraining(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadTrainings();
    } catch (err) {
      setDeleteError(parseTrainingApiError(err));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="admin-panel admin-sec-layout">
      <div className="admin-topbar">
        <div className="admin-sec-search-wrap">
          <div className="admin-search">
            <FiSearch />
            <input placeholder="Search Programs..." />
          </div>
          <div className="admin-bell" role="button" tabIndex={0} aria-label="Notifications">
            <FiBell />
            <span className="admin-bell-dot" />
          </div>
        </div>
      </div>

      <div className="admin-sec-head">
        <div>
          <span className="admin-sec-kicker">Admin · Training</span>
          <h2>Training Programs</h2>
          <p>Create, manage, and track all training courses from one place.</p>
        </div>
        <button
          type="button"
          className="admin-sec-add-btn"
          onClick={() => {
            setShowEditTrainingModal(false);
            setEditingTrainingId(null);
            setShowCreateTrainingModal(true);
          }}
        >
          <FiPlus size={18} />
          Add Institute
        </button>
      </div>

      <div className="admin-sec-stats">
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Total Programs</p>
            <h3 className="admin-stat-value">20</h3>
            <p className="admin-stat-sub">+3 this week</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiBookOpen />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Total enrolled</p>
            <h3 className="admin-stat-value">10</h3>
            <p className="admin-stat-sub">+1 this week</p>
          </div>
          <span className="admin-sec-stat-icon">
            <MdOutlineSchool />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Completed</p>
            <h3 className="admin-stat-value">12</h3>
            <p className="admin-stat-sub">+8 this week</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiBookOpen />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Avg. Duration</p>
            <h3 className="admin-stat-value">7.3 wks</h3>
            <p className="admin-stat-sub">Optimized from 11 weeks</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiClock />
          </span>
        </div>
      </div>

      <div className="admin-panel-card admin-sec-directory">
        <div className="admin-panel-head">
          <h3>All Training Programs</h3>
          <div className="admin-panel-search">
            <FiSearch />
            <input placeholder="Search Programs..." />
          </div>
        </div>

        {listError ? (
          <p className="admin-modal-error admin-directory-fetch-error" role="alert">
            {listError}
          </p>
        ) : null}

        <div className="admin-sec-table-wrap admin-sec-table-wrap--wide">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Trainer</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>Enrollment</th>
                <th>Status</th>
                <th className="admin-action-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty-cell">
                    Loading training programs…
                  </td>
                </tr>
              ) : programs.length === 0 && !listError ? (
                <tr>
                  <td colSpan={7} className="admin-table-empty-cell">
                    No training programs yet.
                  </td>
                </tr>
              ) : (
                pagedPrograms.map((row, rowIndex) => {
                  const menuKey = `${listPage}-${rowIndex}`;
                  const pct =
                    row.capacity > 0
                      ? Math.round((row.enrolled / row.capacity) * 100)
                      : 0;
                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="admin-sec-entity-cell">
                          <span className="admin-sec-avatar" aria-hidden>
                            <FiBookOpen size={18} />
                          </span>
                          <div className="admin-sec-entity-text">
                            <span className="admin-sec-entity-title">{row.program}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-sec-entity-cell">
                          <span className="admin-sec-avatar" aria-hidden>
                            {initialsFromName(row.trainer)}
                          </span>
                          <div className="admin-sec-entity-text">
                            <span className="admin-sec-entity-title">{row.trainer}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-sec-meta-line">
                          <FiClock />
                          {row.duration}
                        </span>
                      </td>
                      <td>
                        <span className="admin-sec-date-cell">
                          <FiCalendar />
                          {row.startDate}
                        </span>
                      </td>
                      <td>
                        <div className="admin-sec-enroll">
                          <span className="admin-sec-enroll-text">
                            {row.enrolled}/{row.capacity}
                          </span>
                          <div className="admin-sec-enroll-track">
                            <div
                              className="admin-sec-enroll-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-status admin-status-inprogress">
                          {row.status}
                        </span>
                      </td>
                      <td className="admin-action-cell">
                        <div
                          className="admin-row-menu"
                          ref={openRowMenu === menuKey ? rowMenuRef : null}
                        >
                          <button
                            type="button"
                            className="admin-row-menu-btn"
                            aria-expanded={openRowMenu === menuKey}
                            aria-label="Row actions"
                            onClick={() =>
                              setOpenRowMenu(openRowMenu === menuKey ? null : menuKey)
                            }
                          >
                            <FiMoreHorizontal />
                          </button>
                          {openRowMenu === menuKey && (
                            <div className="admin-row-dropdown">
                              <button type="button" onClick={() => setOpenRowMenu(null)}>
                                View
                              </button>
                              <button
                                type="button"
                                disabled={!trainingRowHasServerId(row)}
                                title={
                                  trainingRowHasServerId(row)
                                    ? undefined
                                    : "Cannot edit: training id missing from server."
                                }
                                onClick={() => {
                                  if (!trainingRowHasServerId(row)) return;
                                  setSubmitError("");
                                  setForm(rowToTrainingForm(row));
                                  setEditingTrainingId(row.id);
                                  setShowCreateTrainingModal(false);
                                  setShowEditTrainingModal(true);
                                  setOpenRowMenu(null);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="danger"
                                disabled={!trainingRowHasServerId(row)}
                                title={
                                  trainingRowHasServerId(row)
                                    ? undefined
                                    : "Cannot delete: training id missing from server."
                                }
                                onClick={() => {
                                  if (!trainingRowHasServerId(row)) return;
                                  setDeleteError("");
                                  setDeleteConfirm({
                                    id: row.id,
                                    name: row.program,
                                  });
                                  setOpenRowMenu(null);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!listLoading && programs.length > 0 ? (
          <AdminTablePagination
            page={listPage}
            pageSize={ADMIN_TABLE_PAGE_SIZE}
            total={programs.length}
            onPageChange={setListPage}
          />
        ) : null}
      </div>

      {(showCreateTrainingModal || showEditTrainingModal) && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("admin-modal-overlay")) {
              closeTrainingFormModal();
            }
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-head">
              <h3>
                {showEditTrainingModal ? "Edit Training Program" : "Add Training Institute"}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeTrainingFormModal}
              >
                <FiX />
              </button>
            </div>

            <form
              className="admin-modal-form"
              onSubmit={showEditTrainingModal ? handleEditTrainingSubmit : handleCreateSubmit}
            >
              {submitError ? (
                <p className="admin-modal-error" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Program Name*</label>
                  <input
                    placeholder="e.g. Full Stack Development"
                    required
                    value={form.programName}
                    onChange={(e) => updateField("programName", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Trainer*</label>
                  <input
                    placeholder="Trainer Name"
                    required
                    value={form.trainer}
                    onChange={(e) => updateField("trainer", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Development">Development</option>
                    <option value="Management">Management</option>
                    <option value="Data">Data</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Duration*</label>
                  <select
                    required
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                  >
                    <option value="">e.g. 12 weeks</option>
                    <option value="8 weeks">8 weeks</option>
                    <option value="12 weeks">12 weeks</option>
                    <option value="16 weeks">16 weeks</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Capacity*</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 50"
                    required
                    value={form.capacity}
                    onChange={(e) => updateField("capacity", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Start Date*</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </div>
                <div className="admin-field admin-field-span-2">
                  <label>Schedule</label>
                  <input
                    placeholder="e.g. Mon-Fri, 10 AM - 1 PM"
                    value={form.schedule}
                    onChange={(e) => updateField("schedule", e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  disabled={submitLoading}
                  onClick={closeTrainingFormModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-modal-submit"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? showEditTrainingModal
                      ? "Saving…"
                      : "Creating…"
                    : showEditTrainingModal
                      ? "Save changes"
                      : "Create Training"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm ? (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("admin-modal-overlay") && !deleteLoading) {
              setDeleteConfirm(null);
              setDeleteError("");
            }
          }}
        >
          <div className="admin-modal admin-modal-confirm">
            <div className="admin-modal-head">
              <h3>Delete training program</h3>
              <button
                type="button"
                className="admin-modal-close"
                disabled={deleteLoading}
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteError("");
                }}
              >
                <FiX />
              </button>
            </div>
            <p className="admin-delete-confirm-text">
              Remove <strong>{deleteConfirm.name || "this program"}</strong>? This cannot be
              undone.
            </p>
            {deleteError ? (
              <p className="admin-modal-error" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-cancel"
                disabled={deleteLoading}
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteError("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-modal-submit admin-modal-danger"
                disabled={deleteLoading}
                onClick={handleConfirmDeleteTraining}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Training;
