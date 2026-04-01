import API from "../../../api";

/**
 * GET /api/v1/admin/students — list students (array or { data } / { students }).
 */
export function getAdminStudents() {
  return API.get("/api/v1/admin/students", {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * POST /api/v1/admin/students
 * @param {object} body — { fullName, email, phoneNo, course, batch, address, guardianName, guardianPhoneNo }
 */
export function createAdminStudent(body) {
  return API.post("/api/v1/admin/students", body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

const studentPath = (id) => `/api/v1/admin/students/${encodeURIComponent(String(id))}`;

/**
 * PUT /api/v1/admin/students/:id
 * @param {string|number} id
 * @param {object} body — same shape as create
 */
export function updateAdminStudent(id, body) {
  return API.put(studentPath(id), body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * DELETE /api/v1/admin/students/:id
 * @param {string|number} id
 */
export function deleteAdminStudent(id) {
  return API.delete(studentPath(id), {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}
