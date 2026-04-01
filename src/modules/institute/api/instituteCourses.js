import API from "../../../api";

/**
 * List/detail APIs may return `course_id` or `id`.
 * @param {object} course
 * @returns {string | null}
 */
export function getInstituteCourseRecordId(course) {
  if (!course || typeof course !== "object") return null;
  const raw = course.course_id ?? course.courseId ?? course.id;
  if (raw == null) return null;
  const s = String(raw).trim();
  return s === "" ? null : s;
}

/**
 * GET /api/training-institute/courses — returns an array of course objects.
 */
export function getInstituteCourses() {
  return API.get("/api/training-institute/courses", {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * POST /api/training-institute/courses
 * @param {object} body — { courseTitle, courseDescription, courseCategory, courseVideos, courseResources, courseSyllabus }
 */
export function createInstituteCourse(body) {
  return API.post("/api/training-institute/courses", body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * GET /api/training-institute/courses/{id}
 * @param {string} id — course UUID
 */
export function getInstituteCourseById(id) {
  const safeId = encodeURIComponent(String(id));
  return API.get(`/api/training-institute/courses/${safeId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * PUT /api/training-institute/courses/{id} — update existing course (same body shape as create).
 */
export function updateInstituteCourse(id, body) {
  const safeId = encodeURIComponent(String(id));
  return API.put(`/api/training-institute/courses/${safeId}`, body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * DELETE /api/training-institute/courses/{id} — 204 No Content on success.
 */
export function deleteInstituteCourse(id) {
  const safeId = encodeURIComponent(String(id));
  return API.delete(`/api/training-institute/courses/${safeId}`, {
    headers: {
      accept: "*/*",
      "ngrok-skip-browser-warning": "true",
    },
  });
}
