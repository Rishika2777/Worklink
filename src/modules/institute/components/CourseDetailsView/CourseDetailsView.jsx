import React from "react";
import "./CourseDetailsView.css";

function asUrlList(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((x) => x != null && String(x).trim() !== "");
}

function asStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((x) => String(x)).filter((s) => s.trim() !== "");
}

export default function CourseDetailsView({ item, onClose, onBack }) {
  const close = onClose ?? onBack;
  if (!item) return null;

  const title = item.courseTitle ?? item.title ?? "Course";
  const courseId = item.course_id ?? item.courseId ?? item.id ?? "—";
  const category = item.courseCategory ?? "—";
  const description = item.courseDescription ?? item.description ?? "";
  const syllabus = asStringList(item.courseSyllabus);
  const videos = asUrlList(item.courseVideos);
  const resources = asUrlList(item.courseResources);

  return (
    <div className="course-details-overlay" onClick={close} role="presentation">
      <div
        className="course-details-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-details-title"
      >
        <div className="course-details-hero">
          <div className="course-details-hero-text">
            <p className="course-details-eyebrow">Course</p>
            <h2 id="course-details-title">{title}</h2>
            <p className="course-details-meta">
              <span className="course-details-category-pill">{category}</span>
            </p>
          </div>
          <button type="button" className="course-details-close" onClick={close} aria-label="Close">
            ×
          </button>
        </div>

        <div className="course-details-body">
          <section className="course-details-section">
            <h3 className="course-details-section-title">Details</h3>
            <dl className="course-details-dl">
              <div>
                <dt>Course ID</dt>
                <dd>{courseId}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{category}</dd>
              </div>
            </dl>
          </section>

          {description ? (
            <section className="course-details-section">
              <h3 className="course-details-section-title">Description</h3>
              <p className="course-details-description">{description}</p>
            </section>
          ) : null}

          <section className="course-details-section">
            <h3 className="course-details-section-title">
              Syllabus
              <span className="course-details-count">({syllabus.length})</span>
            </h3>
            {syllabus.length === 0 ? (
              <p className="course-details-empty">No syllabus items.</p>
            ) : (
              <ol className="course-details-syllabus">
                {syllabus.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ol>
            )}
          </section>

          <section className="course-details-section">
            <h3 className="course-details-section-title">
              Videos
              <span className="course-details-count">({videos.length})</span>
            </h3>
            {videos.length === 0 ? (
              <p className="course-details-empty">No video links.</p>
            ) : (
              <ul className="course-details-links">
                {videos.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="course-details-section">
            <h3 className="course-details-section-title">
              Resources
              <span className="course-details-count">({resources.length})</span>
            </h3>
            {resources.length === 0 ? (
              <p className="course-details-empty">No resource links.</p>
            ) : (
              <ul className="course-details-links">
                {resources.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
