import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBell,
  FiBriefcase,
  FiMapPin,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { MdOutlineGroups } from "react-icons/md";
import {
  createAdminEmployee,
  deleteAdminEmployee,
  getAdminEmployees,
  updateAdminEmployee,
} from "../../api/adminEmployees";
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

const EMPTY_EMPLOYEE_FORM = {
  fullName: "",
  email: "",
  phoneNo: "",
  role: "",
  department: "",
  location: "",
  salary: "",
};

function mapApiEmployeeToRow(data, index = 0) {
  if (!data) return null;
  const fallbackId = `local-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const sid = data.id != null && data.id !== "" ? String(data.id) : fallbackId;
  const salaryRaw = data.salary;
  const salary =
    salaryRaw != null && salaryRaw !== ""
      ? String(salaryRaw)
      : "";
  return {
    id: sid,
    name: data.fullName ?? "",
    empId: data.empId ?? data.employeeCode ?? `Emp-${sid.replace(/-/g, "").slice(0, 6)}`,
    email: data.email ?? "",
    phone: data.phoneNo ?? "",
    role: data.role ?? "",
    department: data.department ?? "",
    location: data.location ?? "",
    salary,
    status: "Active",
  };
}

function rowToEmployeeForm(row) {
  return {
    fullName: row.name ?? "",
    email: row.email ?? "",
    phoneNo: row.phone ?? "",
    role: row.role ?? "",
    department: row.department ?? "",
    location: row.location ?? "",
    salary: row.salary ?? "",
  };
}

function employeeRowHasServerId(row) {
  return row?.id != null && !String(row.id).startsWith("local-");
}

function normalizeEmployeesPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.employees)) return data.employees;
  return [];
}

function parseEmployeeSubmitError(err) {
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
      ? "Unexpected server response. Open DevTools → Network → employees → Response."
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

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [form, setForm] = useState(() => ({ ...EMPTY_EMPLOYEE_FORM }));
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [listPage, setListPage] = useState(1);
  const rowMenuRef = useRef(null);

  const loadEmployees = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const { data } = await getAdminEmployees();
      const list = normalizeEmployeesPayload(data);
      setEmployees(
        list.map((item, index) => mapApiEmployeeToRow(item, index)).filter(Boolean)
      );
    } catch (err) {
      setListError(parseEmployeeSubmitError(err));
      setEmployees([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(employees.length / ADMIN_TABLE_PAGE_SIZE));
    setListPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [employees.length]);

  const pagedEmployees = useMemo(() => {
    const start = (listPage - 1) * ADMIN_TABLE_PAGE_SIZE;
    return employees.slice(start, start + ADMIN_TABLE_PAGE_SIZE);
  }, [employees, listPage]);

  useEffect(() => {
    if (showAddEmployeeModal) {
      setForm({ ...EMPTY_EMPLOYEE_FORM });
      setSubmitError("");
      setShowEditEmployeeModal(false);
      setEditingEmployeeId(null);
    }
  }, [showAddEmployeeModal]);

  function closeEmployeeFormModal() {
    setShowAddEmployeeModal(false);
    setShowEditEmployeeModal(false);
    setEditingEmployeeId(null);
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

  function buildEmployeePayload() {
    return {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNo: form.phoneNo.trim(),
      role: form.role.trim(),
      department: form.department.trim(),
      location: form.location.trim(),
      salary: form.salary.trim(),
    };
  }

  async function handleAddEmployeeSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitLoading(true);
    try {
      await createAdminEmployee(buildEmployeePayload());
      closeEmployeeFormModal();
      await loadEmployees();
    } catch (err) {
      setSubmitError(parseEmployeeSubmitError(err));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleEditEmployeeSubmit(e) {
    e.preventDefault();
    if (!editingEmployeeId) return;
    setSubmitError("");
    setSubmitLoading(true);
    try {
      await updateAdminEmployee(editingEmployeeId, buildEmployeePayload());
      closeEmployeeFormModal();
      await loadEmployees();
    } catch (err) {
      setSubmitError(parseEmployeeSubmitError(err));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleConfirmDeleteEmployee() {
    if (!deleteConfirm?.id) return;
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAdminEmployee(deleteConfirm.id);
      setDeleteConfirm(null);
      await loadEmployees();
    } catch (err) {
      setDeleteError(parseEmployeeSubmitError(err));
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
            <input placeholder="Search Employees..." />
          </div>
          <div className="admin-bell" role="button" tabIndex={0} aria-label="Notifications">
            <FiBell />
            <span className="admin-bell-dot" />
          </div>
        </div>
      </div>

      <div className="admin-sec-head">
        <div>
          <span className="admin-sec-kicker">Admin · Employees</span>
          <h2>Employees</h2>
          <p>Manage staff records, departments, and roles from one place.</p>
        </div>
        <button
          type="button"
          className="admin-sec-add-btn"
          onClick={() => {
            setShowEditEmployeeModal(false);
            setEditingEmployeeId(null);
            setShowAddEmployeeModal(true);
          }}
        >
          <FiPlus size={18} />
          Add Employees
        </button>
      </div>

      <div className="admin-sec-stats">
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Total Employees</p>
            <h3 className="admin-stat-value">12</h3>
            <p className="admin-stat-sub">+3 this week</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiUser />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Interview Schedule</p>
            <h3 className="admin-stat-value">2</h3>
            <p className="admin-stat-sub">+1 this week</p>
          </div>
          <span className="admin-sec-stat-icon">
            <MdOutlineGroups />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Total Job Posting</p>
            <h3 className="admin-stat-value">25+</h3>
            <p className="admin-stat-sub">+12 this week</p>
          </div>
          <span className="admin-sec-stat-icon">
            <FiBriefcase />
          </span>
        </div>
        <div className="admin-sec-stat">
          <div>
            <p className="admin-stat-label">Shortlisted Candidates</p>
            <h3 className="admin-stat-value">1</h3>
            <p className="admin-stat-sub">+2 this month</p>
          </div>
          <span className="admin-sec-stat-icon">
            <MdOutlineGroups />
          </span>
        </div>
      </div>

      <div className="admin-panel-card admin-sec-directory">
        <div className="admin-panel-head">
          <h3>Employee Directory</h3>
          <div className="admin-panel-search">
            <FiSearch />
            <input placeholder="Search employees..." />
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
                <th>Employee</th>
                <th>Role</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th className="admin-action-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listLoading ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty-cell">
                    Loading employees…
                  </td>
                </tr>
              ) : employees.length === 0 && !listError ? (
                <tr>
                  <td colSpan={6} className="admin-table-empty-cell">
                    No employees yet.
                  </td>
                </tr>
              ) : (
                pagedEmployees.map((row, rowIndex) => {
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
                          <span className="admin-sec-entity-sub">{row.empId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-sec-chip">{row.role}</span>
                    </td>
                    <td>
                      <span className="admin-sec-meta-line">
                        <FiBriefcase />
                        {row.department}
                      </span>
                    </td>
                    <td>
                      <span className="admin-sec-meta-line">
                        <FiMapPin />
                        {row.location}
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
                              disabled={!employeeRowHasServerId(row)}
                              title={
                                employeeRowHasServerId(row)
                                  ? undefined
                                  : "Cannot edit: employee id missing from server."
                              }
                              onClick={() => {
                                if (!employeeRowHasServerId(row)) return;
                                setSubmitError("");
                                setForm(rowToEmployeeForm(row));
                                setEditingEmployeeId(row.id);
                                setShowAddEmployeeModal(false);
                                setShowEditEmployeeModal(true);
                                setOpenRowMenu(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="danger"
                              disabled={!employeeRowHasServerId(row)}
                              title={
                                employeeRowHasServerId(row)
                                  ? undefined
                                  : "Cannot delete: employee id missing from server."
                              }
                              onClick={() => {
                                if (!employeeRowHasServerId(row)) return;
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

        {!listLoading && employees.length > 0 ? (
          <AdminTablePagination
            page={listPage}
            pageSize={ADMIN_TABLE_PAGE_SIZE}
            total={employees.length}
            onPageChange={setListPage}
          />
        ) : null}
      </div>

      {(showAddEmployeeModal || showEditEmployeeModal) && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("admin-modal-overlay")) {
              closeEmployeeFormModal();
            }
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-head">
              <h3>{showEditEmployeeModal ? "Edit Employee" : "Add New Employees"}</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeEmployeeFormModal}
              >
                <FiX />
              </button>
            </div>

            <form
              className="admin-modal-form"
              onSubmit={showEditEmployeeModal ? handleEditEmployeeSubmit : handleAddEmployeeSubmit}
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
                    placeholder="e.g. Rahul Verma"
                    required
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Email*</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
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
                <div className="admin-field">
                  <label>Role*</label>
                  <input
                    placeholder="e.g. Senior Trainer"
                    required
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Department*</label>
                  <select
                    required
                    value={form.department}
                    onChange={(e) => updateField("department", e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="Training">Training</option>
                    <option value="Technical">Technical</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Location*</label>
                  <input
                    placeholder="e.g. indore"
                    required
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>
                <div className="admin-field admin-field-span-2">
                  <label>Salary*</label>
                  <input
                    placeholder="e.g. Rs. 1,25,000/mo"
                    required
                    value={form.salary}
                    onChange={(e) => updateField("salary", e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  disabled={submitLoading}
                  onClick={closeEmployeeFormModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-modal-submit"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? showEditEmployeeModal
                      ? "Saving…"
                      : "Adding…"
                    : showEditEmployeeModal
                      ? "Save changes"
                      : "Add Employee"}
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
              <h3>Delete employee</h3>
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
              Remove <strong>{deleteConfirm.name || "this employee"}</strong> from the directory?
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
                onClick={handleConfirmDeleteEmployee}
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

export default Employees;
