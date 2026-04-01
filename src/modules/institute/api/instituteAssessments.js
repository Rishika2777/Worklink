import API from "../../../api";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

const GET_HEADERS = {
  "ngrok-skip-browser-warning": "true",
};

/**
 * GET /api/training-institute/assessments — list assessments.
 */
export function getInstituteAssessments() {
  return API.get("/api/training-institute/assessments", {
    headers: GET_HEADERS,
  });
}

/**
 * GET /api/training-institute/assessments/{id}
 */
export function getInstituteAssessmentById(id) {
  const safeId = encodeURIComponent(String(id));
  return API.get(`/api/training-institute/assessments/${safeId}`, {
    headers: GET_HEADERS,
  });
}

/**
 * POST /api/training-institute/assessments — create assessment.
 */
export function createInstituteAssessment(body) {
  return API.post("/api/training-institute/assessments", body, {
    headers: JSON_HEADERS,
  });
}

/**
 * PUT /api/training-institute/assessments/{assessment_id} — update (body: assessmentTitle, courseName, …).
 */
export function updateInstituteAssessment(assessmentId, body) {
  const safeId = encodeURIComponent(String(assessmentId));
  return API.put(`/api/training-institute/assessments/${safeId}`, body, {
    headers: JSON_HEADERS,
  });
}

/**
 * DELETE /api/training-institute/assessments/{id}
 */
export function deleteInstituteAssessment(id) {
  const safeId = encodeURIComponent(String(id));
  return API.delete(`/api/training-institute/assessments/${safeId}`, {
    headers: {
      accept: "*/*",
      "ngrok-skip-browser-warning": "true",
    },
  });
}
