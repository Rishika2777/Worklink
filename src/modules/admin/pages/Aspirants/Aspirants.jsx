import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiMail,
  FiMoreHorizontal,
  FiPhone,
  FiPlus,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { MdOutlineSchool, MdOutlineTrendingUp } from "react-icons/md";
import {
  createAdminStudent,
  deleteAdminStudent,
  getAdminStudents,
  updateAdminStudent,
} from "../../api/adminStudents";
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

const EMPTY_STUDENT_FORM = {
  fullName: "",
  email: "",
  phoneNo: "",
  course: "",
  batch: "",
  address: "",
  guardianName: "",
  guardianPhoneNo: "",
};

function formatStudentListDate(d = new Date()) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function studentRowDateFromApi(data) {
  const raw =
    data?.createdAt ??
    data?.created_at ??
    data?.enrollmentDate ??
    data?.updatedAt ??
    data?.updated_at;
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      return formatStudentListDate(d);
    }
  }
  return formatStudentListDate();
}

function resolveStudentIdFromApi(data) {
  const raw =
    data?.id ??
    data?.studentId ??
    data?.student_id ??
    data?.uuid ??
    data?.userId;
  if (raw != null && raw !== "") return String(raw);
  return null;
}

function mapApiStudentToRow(data, index = 0) {
  if (!data) return null;
  const fallbackId = `local-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const resolved = resolveStudentIdFromApi(data);
  return {
    id: resolved ?? fallbackId,
    name: data.fullName ?? "",
    email: data.email ?? "",
    phone: data.phoneNo ?? "",
    course: data.course ?? "",
    batch: data.batch ?? "",
    address: data.address ?? "",
    guardianName: data.guardianName ?? "",
    guardianPhoneNo: data.guardianPhoneNo ?? "",
    date: studentRowDateFromApi(data),
    status: data.status ?? "Active",
  };
}

function rowToStudentForm(row) {
  return {
    fullName: row.name ?? "",
    email: row.email ?? "",
    phoneNo: row.phone ?? "",
    course: row.course ?? "",
    batch: row.batch ?? "",
    address: row.address ?? "",
    guardianName: row.guardianName ?? "",
    guardianPhoneNo: row.guardianPhoneNo ?? "",
  };
}

/** Rows without a real API id use ids starting with `local-` (PUT/DELETE need a server id). */
function isPlaceholderStudentId(id) {
  return id == null || String(id).startsWith("local-");
}

const NO_SERVER_ID_MSG =
  "This row has no server id yet. PUT /api/v1/admin/students/{id} needs the id returned from GET /api/v1/admin/students (or after POST). Reload the list when your backend sends ids.";

function normalizeStudentsPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.students)) return data.students;
  return [];
}

function parseStudentSubmitError(err) {
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
      ? "Unexpected server response. Open DevTools → Network → students → Response."
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

function Aspirants() {
  const [students, setStudents] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [form, setForm] = useState(() => ({ ...EMPTY_STUDENT_FORM }));
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [listPage, setListPage] = useState(1);
  const rowMenuRef = useRef(null);

  const loadStudents = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const { data } = await getAdminStudents();
      const list = normalizeStudentsPayload(data);
      setStudents(
        list.map((item, index) => mapApiStudentToRow(item, index)).filter(Boolean)
      );
    } catch (err) {
      setListError(parseStudentSubmitError(err));
      setStudents([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(students.length / ADMIN_TABLE_PAGE_SIZE));
    setListPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [students.length]);

  const pagedStudents = useMemo(() => {
    const start = (listPage - 1) * ADMIN_TABLE_PAGE_SIZE;
    return students.slice(start, start + ADMIN_TABLE_PAGE_SIZE);
  }, [students, listPage]);

  useEffect(() => {
    if (showAddStudentModal) {
      setForm({ ...EMPTY_STUDENT_FORM });
      setSubmitError("");
      setShowEditStudentModal(false);
      setEditingStudentId(null);
    }
  }, [showAddStudentModal]);

  function closeStudentFormModal() {
    setShowAddStudentModal(false);
    setShowEditStudentModal(false);
    setEditingStudentId(null);
    setSubmitError("");
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setOpenRowMenu(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildStudentPayload() {
    return {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNo: form.phoneNo.trim(),
      course: form.course.trim(),
      batch: form.batch.trim(),
      address: form.address.trim(),
      guardianName: (form.guardianName || "").trim(),
      guardianPhoneNo: (form.guardianPhoneNo || "").trim(),
    };
  }

  async function handleAddStudentSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitLoading(true);
    try {
      await createAdminStudent(buildStudentPayload());
      closeStudentFormModal();
      await loadStudents();
    } catch (err) {
      setSubmitError(parseStudentSubmitError(err));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleEditStudentSubmit(e) {
    e.preventDefault();
    if (!editingStudentId) return;
    setSubmitError("");
    if (isPlaceholderStudentId(editingStudentId)) {
      setSubmitError(NO_SERVER_ID_MSG);
      return;
    }
    setSubmitLoading(true);
    try {
      await updateAdminStudent(editingStudentId, buildStudentPayload());
      closeStudentFormModal();
      await loadStudents();
    } catch (err) {
      setSubmitError(parseStudentSubmitError(err));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleConfirmDeleteStudent() {
    if (!deleteConfirm?.id) return;
    setDeleteError("");
    if (isPlaceholderStudentId(deleteConfirm.id)) {
      setDeleteError(NO_SERVER_ID_MSG);
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteAdminStudent(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadStudents();
    } catch (err) {
      setDeleteError(parseStudentSubmitError(err));
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
            <input placeholder="Search Students..." />
          </div>
          <div className="admin-bell" role="button" tabIndex={0} aria-label="Notifications">
            <FiBell />
            <span className="admin-bell-dot" />
          </div>
        </div>
      </div>

      <div className="admin-sec-head">
        <div>
          <span className="admin-sec-kicker">Admin · Students</span>
          <h2>Students</h2>
          <p>Manage student enrollments, batches, and performance from one place.</p>
        </div>
        <button
          type="button"
          className="admin-sec-add-btn"
          onClick={() => {
            setShowEditStudentModal(false);
            setEditingStudentId(null);
            setShowAddStudentModal(true);
          }}
        >
          <FiPlus size={18} />
          Add Student
        </button>
      </div>

      <div className="admin-sec-stats">
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Total Students</p>
            <h3 className="admin-stat-value">1,600</h3>
            <p className="admin-stat-sub">+9.3% from last month</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiUsers />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Active Batches</p>
            <h3 className="admin-stat-value">18</h3>
            <p className="admin-stat-sub">3 starting soon</p>
          </div>
          <span className="admin-sec-stat-icon">
            <MdOutlineSchool />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Avg Performance</p>
            <h3 className="admin-stat-value">85%</h3>
            <p className="admin-stat-sub">+1.4 vs last month</p>
          </div>
          <span className="admin-sec-stat-icon">
            <MdOutlineTrendingUp />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Placement Rate</p>
            <h3 className="admin-stat-value">84.6%</h3>
            <p className="admin-stat-sub">Top performer: B.23A</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiUsers />
          </span>
        </div>
      </div>

      <div className="admin-panel-card admin-sec-directory">
        <div className="admin-panel-head">
          <h3>Student Directory</h3>
          <div className="admin-panel-search">
            <FiSearch />
            <input placeholder="Search Students..." />
          </div>
        </div>

        {listError ? (
          <p className="admin-modal-error admin-directory-fetch-error" role="alert">
            {listError}
          </p>
        ) : null}

        <div className="admin-sec-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th className="admin-action-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty-cell">
                    Loading students…
                  </td>
                </tr>
              ) : students.length === 0 && !listError ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty-cell">
                    No students yet.
                  </td>
                </tr>
              ) : (
                pagedStudents.map((row, rowIndex) => {
                  const menuKey = `${listPage}-${rowIndex}`;
                  return (
                  <tr key={row.id}>
                    <td>
                      <div className="admin-sec-entity-cell">
                        <span className="admin-sec-avatar" aria-hidden>
                          {initialsFromName(row.name)}
                        </span>
                        <div className="admin-sec-entity-text">
                          <span className="admin-sec-entity-title">{row.name}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-contact-stack">
                        <div className="admin-contact-line">
                          <FiMail />
                          <span>{row.email}</span>
                        </div>
                        <div className="admin-contact-line">
                          <FiPhone />
                          <span>{row.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-sec-chip">{row.course}</span>
                    </td>
                    <td>
                      <span className="admin-sec-date-cell">
                        <FiCalendar />
                        {row.date}
                      </span>
                    </td>
                    <td>
                      <span className="admin-status active">{row.status}</span>
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
                              onClick={() => {
                                setSubmitError("");
                                setForm(rowToStudentForm(row));
                                setEditingStudentId(row.id);
                                setShowAddStudentModal(false);
                                setShowEditStudentModal(true);
                                setOpenRowMenu(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="danger"
                              onClick={() => {
                                setDeleteError("");
                                setDeleteConfirm({ id: row.id, name: row.name });
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

        {!listLoading && students.length > 0 ? (
          <AdminTablePagination
            page={listPage}
            pageSize={ADMIN_TABLE_PAGE_SIZE}
            total={students.length}
            onPageChange={setListPage}
          />
        ) : null}
      </div>

      {(showAddStudentModal || showEditStudentModal) && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("admin-modal-overlay")) {
              closeStudentFormModal();
            }
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-head">
              <h3>{showEditStudentModal ? "Edit Student" : "Add New Student"}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeStudentFormModal}
              >
                <FiX />
              </button>
            </div>

            <form
              className="admin-modal-form"
              onSubmit={showEditStudentModal ? handleEditStudentSubmit : handleAddStudentSubmit}
            >
              {submitError ? (
                <p className="admin-modal-error" role="alert">
                  {submitError}
                </p>
              ) : null}
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Full Name*</label>
                  <input
                    placeholder="e.g. John Sharma"
                    required
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Email*</label>
                  <input
                    type="email"
                    placeholder="e.g. john@gmail.com"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Phone no.*</label>
                  <input
                    placeholder="+918765432100"
                    required
                    value={form.phoneNo}
                    onChange={(e) => updateField("phoneNo", e.target.value)}
                  />
                </div>
                <div className="admin-field admin-field-span-2">
                  <label>Course*</label>
                  <select
                    required
                    value={form.course}
                    onChange={(e) => updateField("course", e.target.value)}
                  >
                    <option value="">Select Course</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Full Stack Dev">Full Stack Dev</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Cloud Architecture">Cloud Architecture</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Batch*</label>
                  <select
                    required
                    value={form.batch}
                    onChange={(e) => updateField("batch", e.target.value)}
                  >
                    <option value="">Select Batch</option>
                    <option value="Batch A">Batch A</option>
                    <option value="Batch B">Batch B</option>
                    <option value="B.23A">B.23A</option>
                    <option value="B.23B">B.23B</option>
                    <option value="B.24A">B.24A</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Address*</label>
                  <input
                    placeholder="City, State"
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Guardian Name</label>
                  <input
                    placeholder="e.g. Shripal Sharma"
                    value={form.guardianName}
                    onChange={(e) => updateField("guardianName", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Guardian Phone no.</label>
                  <input
                    placeholder="+919876543210"
                    value={form.guardianPhoneNo}
                    onChange={(e) => updateField("guardianPhoneNo", e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  disabled={submitLoading}
                  onClick={closeStudentFormModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-modal-submit"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? showEditStudentModal
                      ? "Saving…"
                      : "Adding…"
                    : showEditStudentModal
                      ? "Save changes"
                      : "Add Student"}
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
              <h3>Delete student</h3>
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
              Remove <strong>{deleteConfirm.name || "this student"}</strong> from the directory?
              This cannot be undone.
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
                onClick={handleConfirmDeleteStudent}
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

export default Aspirants;
