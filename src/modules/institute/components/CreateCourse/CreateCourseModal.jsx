import { useEffect, useState } from "react";
import "./CreateCourseModal.css";
import { FiBookOpen, FiBox, FiFileText, FiPlus, FiTrash2, FiVideo } from "react-icons/fi";
import {
  createInstituteCourse,
  getInstituteCourseById,
  updateInstituteCourse,
} from "../../api/instituteCourses";

const CATEGORY_OPTIONS = [
  "Development",
  "Web Development",
  "Design",
  "Data Science",
];

function cleanStringList(arr) {
  return (arr || []).map((s) => String(s).trim()).filter(Boolean);
}

function parseCourseApiError(err) {
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
    "Could not save course."
  );
}

function listFieldFromApi(arr) {
  const a = Array.isArray(arr) ? arr : [];
  return a.length ? a.map((x) => String(x)) : [""];
}

function CreateCourseModal({ close, onCreated, courseId }) {
  const [step, setStep] = useState(1);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseVideos, setCourseVideos] = useState([""]);
  const [courseResources, setCourseResources] = useState([""]);
  const [courseSyllabus, setCourseSyllabus] = useState([""]);
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(Boolean(courseId));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!courseId) {
      setLoadLoading(false);
      setLoadError("");
      return undefined;
    }
    setLoadLoading(true);
    setLoadError("");
    setStep(1);
    getInstituteCourseById(courseId)
      .then(({ data }) => {
        if (cancelled) return;
        const c = data?.data ?? data;
        if (!c || typeof c !== "object") {
          setLoadError("Invalid course data from server.");
          setLoadLoading(false);
          return;
        }
        setCourseTitle(c.courseTitle ?? "");
        setCourseDescription(c.courseDescription ?? "");
        setCourseCategory(c.courseCategory ?? "");
        setCourseVideos(listFieldFromApi(c.courseVideos));
        setCourseResources(listFieldFromApi(c.courseResources));
        setCourseSyllabus(listFieldFromApi(c.courseSyllabus));
        setLoadLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setLoadError(parseCourseApiError(e));
        setLoadLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const showForm =
    !loadLoading && !(courseId && loadError);

  function updateListItem(list, setList, index, value) {
    setList((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addListItem(setList) {
    setList((prev) => [...prev, ""]);
  }

  function removeListItem(setList, index) {
    setList((prev) => (prev.length <= 1 ? [""] : prev.filter((_, i) => i !== index)));
  }

  function validateStep1() {
    if (!courseTitle.trim()) return "Course title is required.";
    if (!courseDescription.trim()) return "Course description is required.";
    if (!courseCategory.trim()) return "Category is required.";
    return "";
  }

  function handleNextFromStep1() {
    const err = validateStep1();
    if (err) {
      setSubmitError(err);
      return;
    }
    setSubmitError("");
    setStep(2);
  }

  async function handleFinish() {
    const err = validateStep1();
    if (err) {
      setSubmitError(err);
      setStep(1);
      return;
    }
    setSubmitError("");
    setSubmitLoading(true);
    const payload = {
      courseTitle: courseTitle.trim(),
      courseDescription: courseDescription.trim(),
      courseCategory: courseCategory.trim(),
      courseVideos: cleanStringList(courseVideos),
      courseResources: cleanStringList(courseResources),
      courseSyllabus: cleanStringList(courseSyllabus),
    };
    try {
      if (courseId) {
        await updateInstituteCourse(courseId, payload);
      } else {
        await createInstituteCourse(payload);
      }
      if (typeof onCreated === "function") onCreated();
      close();
    } catch (e) {
      setSubmitError(parseCourseApiError(e));
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div
      className="course-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{courseId ? "Edit course" : "Create New Courses"}</h2>
          <button type="button" className="cancel-btn" onClick={close}>
            Cancel
          </button>
        </div>

        <p className="step-text">Step {step} of 4</p>

        {loadLoading ? (
          <p className="course-modal-loading" role="status">
            Loading course…
          </p>
        ) : null}

        {loadError ? (
          <p className="course-modal-error" role="alert">
            {loadError}
          </p>
        ) : null}

        {submitError ? (
          <p className="course-modal-error" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className={`stepper${!showForm ? " course-modal-stepper-dim" : ""}`}>
          <div className="step-block">
            <div className={step === 1 ? "circle active" : "circle"}>1</div>
            <p>Basic Info</p>
            <span>Course Details</span>
          </div>
          <div className="line" />
          <div className="step-block">
            <div className={step === 2 ? "circle active" : "circle"}>2</div>
            <p>Videos</p>
            <span>Video Lectures</span>
          </div>
          <div className="line" />
          <div className="step-block">
            <div className={step === 3 ? "circle active" : "circle"}>3</div>
            <p>Resources</p>
            <span>Notes & PDF</span>
          </div>
          <div className="line" />
          <div className="step-block">
            <div className={step === 4 ? "circle active" : "circle"}>4</div>
            <p>Syllabus</p>
            <span>Course Structure</span>
          </div>
        </div>

        {step === 1 && showForm && (
          <div className="course-card">
            <div className="course-card-title">
              <FiBookOpen />
              <h3>Course Details</h3>
            </div>
            <p className="card-desc">Enter the basic information about your course</p>
            <label className="course-field-label" htmlFor="course-title">
              Course Title
              <span className="course-field-required" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="course-title"
              name="courseTitle"
              placeholder="e.g. Full Stack Web Development"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              autoComplete="off"
              aria-required="true"
            />
            <label className="course-field-label" htmlFor="course-description">
              Course Description
              <span className="course-field-required" aria-hidden="true">
                *
              </span>
            </label>
            <textarea
              id="course-description"
              name="courseDescription"
              placeholder="Describe what this course covers, who it's for, and what students will achieve..."
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              rows={5}
              aria-required="true"
            />
            <label className="course-field-label" htmlFor="course-category">
              Category
              <span className="course-field-required" aria-hidden="true">
                *
              </span>
            </label>
            <select
              id="course-category"
              name="courseCategory"
              value={courseCategory}
              onChange={(e) => setCourseCategory(e.target.value)}
              aria-required="true"
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              {courseCategory && !CATEGORY_OPTIONS.includes(courseCategory) ? (
                <option value={courseCategory}>{courseCategory}</option>
              ) : null}
            </select>
            <div className="step-buttons">
              <button type="button" className="next-btn" onClick={handleNextFromStep1}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && showForm && (
          <div className="course-card">
            <div className="course-card-title">
              <FiVideo />
              <h3>Video Lectures</h3>
            </div>
            <p className="card-desc">Add video URLs (one per line field)</p>
            <div className="course-dynamic-list">
              {courseVideos.map((url, i) => (
                <div key={`v-${i}`} className="course-dynamic-row">
                  <input
                    type="url"
                    placeholder="https://example.com/videos/introduction.mp4"
                    value={url}
                    onChange={(e) => updateListItem(courseVideos, setCourseVideos, i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="course-row-remove"
                    aria-label="Remove"
                    onClick={() => removeListItem(setCourseVideos, i)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="ghost-btn course-add-btn"
                onClick={() => addListItem(setCourseVideos)}
              >
                <FiPlus /> Add video URL
              </button>
            </div>
            <div className="step-buttons">
              <button type="button" className="prev-btn" onClick={() => setStep(1)}>
                Previous
              </button>
              <button type="button" className="next-btn" onClick={() => setStep(3)}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && showForm && (
          <div className="course-card">
            <div className="course-card-title">
              <FiFileText />
              <h3>Notes & Resources</h3>
            </div>
            <p className="card-desc">PDFs, repos, and other resource URLs</p>
            <div className="course-dynamic-list">
              {courseResources.map((url, i) => (
                <div key={`r-${i}`} className="course-dynamic-row">
                  <input
                    type="url"
                    placeholder="https://example.com/resources/notes.pdf"
                    value={url}
                    onChange={(e) =>
                      updateListItem(courseResources, setCourseResources, i, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="course-row-remove"
                    aria-label="Remove"
                    onClick={() => removeListItem(setCourseResources, i)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="ghost-btn course-add-btn"
                onClick={() => addListItem(setCourseResources)}
              >
                <FiPlus /> Add resource URL
              </button>
            </div>
            <div className="step-buttons">
              <button type="button" className="prev-btn" onClick={() => setStep(2)}>
                Previous
              </button>
              <button type="button" className="next-btn" onClick={() => setStep(4)}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && showForm && (
          <div className="course-card">
            <div className="course-card-title">
              <FiBox />
              <h3>Course Syllabus</h3>
            </div>
            <p className="card-desc">Topics or modules (one per line)</p>
            <div className="course-dynamic-list">
              {courseSyllabus.map((line, i) => (
                <div key={`s-${i}`} className="course-dynamic-row">
                  <input
                    placeholder="e.g. Introduction to Web Development"
                    value={line}
                    onChange={(e) =>
                      updateListItem(courseSyllabus, setCourseSyllabus, i, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="course-row-remove"
                    aria-label="Remove"
                    onClick={() => removeListItem(setCourseSyllabus, i)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="ghost-btn course-add-btn"
                onClick={() => addListItem(setCourseSyllabus)}
              >
                <FiPlus /> Add syllabus item
              </button>
            </div>
            <div className="step-buttons">
              <button type="button" className="prev-btn" onClick={() => setStep(3)}>
                Previous
              </button>
              <button
                type="button"
                className="next-btn"
                disabled={submitLoading}
                onClick={handleFinish}
              >
                {submitLoading
                  ? "Saving…"
                  : courseId
                    ? "Save changes"
                    : "Finish & publish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateCourseModal;
