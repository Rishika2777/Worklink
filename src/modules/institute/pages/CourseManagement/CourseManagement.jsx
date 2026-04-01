import "./CourseManagement.css";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateCourseModal from "../../components/CreateCourse/CreateCourseModal";
import CourseDetailsView from "../../components/CourseDetailsView/CourseDetailsView";
import {
  deleteInstituteCourse,
  getInstituteCourseById,
  getInstituteCourseRecordId,
  getInstituteCourses,
} from "../../api/instituteCourses";
import { FiBell, FiSearch, FiMoreVertical } from "react-icons/fi";
import { MdOutlinePlayLesson } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { TbCurrencyDollar } from "react-icons/tb";

function normalizeCoursesPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.courses)) return data.courses;
  return [];
}

function parseListError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    return d.length > 400 ? "Could not load courses." : d;
  }
  return d?.message || err.message || "Could not load courses.";
}

function parseActionError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    return d.length > 400 ? "Request failed." : d;
  }
  return d?.message || err.message || "Could not delete course.";
}

function parseCourseDetailError(err) {
  const d = err.response?.data;
  if (typeof d === "string") {
    return d.length > 400 ? "Could not load course." : d;
  }
  return d?.message || err.message || "Could not load course.";
}

/** Fixed menu so it is never clipped by table/card; flip up if not enough space below. */
function computeCourseActionMenuPosition(wrapperEl) {
  const r = wrapperEl.getBoundingClientRect();
  const MENU_W = 148;
  const MENU_H = 132;
  const gap = 8;
  const margin = 8;
  let top = r.bottom + gap;
  const spaceBelow = window.innerHeight - r.bottom - gap;
  if (spaceBelow < MENU_H && r.top > MENU_H + gap) {
    top = r.top - MENU_H - gap;
  }
  top = Math.max(margin, Math.min(top, window.innerHeight - MENU_H - margin));
  let left = r.right - MENU_W;
  left = Math.max(margin, Math.min(left, window.innerWidth - MENU_W - margin));
  return { top, left };
}

function CourseManagement() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuFixed, setMenuFixed] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const loadCourses = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const { data } = await getInstituteCourses();
      setCourses(normalizeCoursesPayload(data));
    } catch (err) {
      setListError(parseListError(err));
      setCourses([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const openMenuCourse = useMemo(() => {
    if (!openMenuId) return null;
    return (
      courses.find((c, i) => {
        const recordId = getInstituteCourseRecordId(c);
        const rowKey = recordId ?? `row-${i}`;
        return rowKey === openMenuId;
      }) ?? null
    );
  }, [openMenuId, courses]);

  useEffect(() => {
    if (!openMenuId) return undefined;
    const close = () => {
      setOpenMenuId(null);
      setMenuFixed(null);
    };
    const onPointerDown = (e) => {
      if (e.target.closest?.(".dropdown-menu")) return;
      if (e.target.closest?.(".action-wrapper")) return;
      close();
    };
    window.addEventListener("mousedown", onPointerDown, true);
    const onScroll = () => close();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("mousedown", onPointerDown, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [openMenuId]);

  function closeActionMenu() {
    setOpenMenuId(null);
    setMenuFixed(null);
  }

  async function handleViewCourse(course) {
    const id = getInstituteCourseRecordId(course);
    if (!id) return;
    closeActionMenu();
    setViewError("");
    setViewLoading(true);
    setViewItem(null);
    try {
      const { data } = await getInstituteCourseById(id);
      const raw = data?.data ?? data;
      setViewItem(raw && typeof raw === "object" ? raw : null);
    } catch (err) {
      setViewError(parseCourseDetailError(err));
      setViewItem(null);
    } finally {
      setViewLoading(false);
    }
  }

  async function handleDeleteCourse(course) {
    const id = getInstituteCourseRecordId(course);
    if (!id) return;
    const title = course.courseTitle ?? "this course";
    if (
      !window.confirm(`Delete "${title}"? This cannot be undone.`)
    ) {
      return;
    }
    setActionError("");
    setDeletingId(id);
    try {
      await deleteInstituteCourse(id);
      closeActionMenu();
      await loadCourses();
    } catch (err) {
      setActionError(parseActionError(err));
    } finally {
      setDeletingId(null);
    }
  }

  const actionMenuPortal =
    openMenuId && menuFixed && openMenuCourse
      ? (() => {
          const portalRecordId = getInstituteCourseRecordId(openMenuCourse);
          return createPortal(
            <div
              className="dropdown-menu dropdown-menu--fixed"
              style={{
                position: "fixed",
                top: menuFixed.top,
                left: menuFixed.left,
                zIndex: 10000,
              }}
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="dropdown-item"
                role="menuitem"
                disabled={!portalRecordId}
                onClick={() => {
                  if (!openMenuCourse) return;
                  handleViewCourse(openMenuCourse);
                }}
              >
                View
              </button>
              <button
                type="button"
                className="dropdown-item"
                role="menuitem"
                onClick={() => {
                  if (!portalRecordId) return;
                  setEditingCourseId(portalRecordId);
                  closeActionMenu();
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="dropdown-item delete"
                role="menuitem"
                disabled={!portalRecordId || deletingId === portalRecordId}
                onClick={() => handleDeleteCourse(openMenuCourse)}
              >
                {deletingId === portalRecordId ? "Deleting…" : "Delete"}
              </button>
            </div>,
            document.body
          );
        })()
      : null;

  return (
    <div className="course-container">
      <div className="course-header">
        <div />
        <div className="course-actions">
          <FiBell className="bell-icon" />
          <button
            type="button"
            className="add-course-btn"
            onClick={() => {
              setEditingCourseId(null);
              setShowModal(true);
            }}
          >
            + Add New Courses
          </button>
        </div>
      </div>

      <div className="course-filters">
        <button type="button" className="filter active">
          <MdOutlinePlayLesson className="filter-icon" />
          Active Courses
        </button>
        <button type="button" className="filter">
          <RiCalendarScheduleLine className="filter-icon" />
          Upcoming Courses
        </button>
        <button type="button" className="filter">
          <TbTag className="filter-icon" />
          Free Courses
        </button>
        <button type="button" className="filter">
          <TbCurrencyDollar className="filter-icon" />
          Paid Courses
        </button>
      </div>

      <div className="course-card">
        <div className="course-card-header">
          <h3>Course List</h3>
          <div className="search-box">
            <FiSearch />
            <input placeholder="Search...." />
          </div>
        </div>

        {listError ? (
          <p className="course-list-error" role="alert">
            {listError}
          </p>
        ) : null}

        {actionError ? (
          <p className="course-list-error" role="alert">
            {actionError}
          </p>
        ) : null}

        <table className="course-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Course name</th>
              <th>Category</th>
              <th>Syllabus</th>
              <th>Videos</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr>
                <td colSpan={6} className="course-table-empty">
                  Loading courses…
                </td>
              </tr>
            ) : courses.length === 0 && !listError ? (
              <tr>
                <td colSpan={6} className="course-table-empty">
                  No courses yet. Add one with &quot;+ Add New Courses&quot;.
                </td>
              </tr>
            ) : (
              courses.map((course, index) => {
                const recordId = getInstituteCourseRecordId(course);
                const rowKey = recordId ?? `row-${index}`;
                const syllabusCount = Array.isArray(course.courseSyllabus)
                  ? course.courseSyllabus.length
                  : 0;
                const videosCount = Array.isArray(course.courseVideos)
                  ? course.courseVideos.length
                  : 0;
                return (
                  <tr key={rowKey}>
                    <td>{index + 1}</td>
                    <td>{course.courseTitle ?? "—"}</td>
                    <td>{course.courseCategory ?? "—"}</td>
                    <td>{syllabusCount}</td>
                    <td>{videosCount}</td>
                    <td className="action-cell">
                      <div
                        className={
                          openMenuId === rowKey
                            ? "action-wrapper action-wrapper--open"
                            : "action-wrapper"
                        }
                      >
                        <FiMoreVertical
                          className="action-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openMenuId === rowKey) {
                              closeActionMenu();
                              return;
                            }
                            const wrap = e.currentTarget.closest(".action-wrapper");
                            if (wrap) {
                              setMenuFixed(computeCourseActionMenuPosition(wrap));
                            }
                            setOpenMenuId(rowKey);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {actionMenuPortal}

      {viewLoading ? (
        <div
          className="course-view-overlay"
          role="alert"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="course-detail-loading">Loading course…</div>
        </div>
      ) : null}

      {viewError && !viewLoading ? (
        <div
          className="course-view-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-view-error-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewError("");
          }}
        >
          <div className="course-view-error-modal">
            <h3 id="course-view-error-title">Could not load course</h3>
            <p className="course-view-error-text" role="alert">
              {viewError}
            </p>
            <div className="course-view-error-actions">
              <button
                type="button"
                className="course-view-error-close"
                onClick={() => setViewError("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {viewItem && !viewLoading ? (
        <CourseDetailsView
          item={viewItem}
          onBack={() => {
            setViewItem(null);
            setViewError("");
          }}
        />
      ) : null}

      {showModal && (
        <CreateCourseModal
          courseId={editingCourseId}
          close={() => {
            setShowModal(false);
            setEditingCourseId(null);
          }}
          onCreated={loadCourses}
        />
      )}
    </div>
  );
}

export default CourseManagement;
