import API from "../../../api";

/**
 * GET /api/v1/admin/trainings — list trainings (array or { data } / { trainings }).
 */
export function getAdminTrainings() {
  return API.get("/api/v1/admin/trainings", {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * POST /api/v1/admin/trainings
 * @param {object} body — { programName, trainer, category, duration, capacity, startDate, schedule }
 */
export function createAdminTraining(body) {
  return API.post("/api/v1/admin/trainings", body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

const trainingPath = (id) => `/api/v1/admin/trainings/${encodeURIComponent(String(id))}`;

/**
 * PUT /api/v1/admin/trainings/:id
 * @param {string|number} id
 * @param {object} body — same shape as create
 */
export function updateAdminTraining(id, body) {
  return API.put(trainingPath(id), body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * DELETE /api/v1/admin/trainings/:id
 * @param {string|number} id
 */
export function deleteAdminTraining(id) {
  return API.delete(trainingPath(id), {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}
