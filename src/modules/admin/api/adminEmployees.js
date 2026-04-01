import API from "../../../api";

/**
 * GET /api/v1/admin/employees — returns an array of employee objects (or wrapped in { data }).
 */
export function getAdminEmployees() {
  return API.get("/api/v1/admin/employees", {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * POST /api/v1/admin/employees
 * @param {object} body — { fullName, email, phoneNo, role, department, location, salary }
 */
export function createAdminEmployee(body) {
  return API.post("/api/v1/admin/employees", body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

const employeePath = (id) => `/api/v1/admin/employees/${encodeURIComponent(String(id))}`;

/**
 * PUT /api/v1/admin/employees/:id
 * @param {string|number} id
 * @param {object} body — same shape as create
 */
export function updateAdminEmployee(id, body) {
  return API.put(employeePath(id), body, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });
}

/**
 * DELETE /api/v1/admin/employees/:id
 * @param {string|number} id
 */
export function deleteAdminEmployee(id) {
  return API.delete(employeePath(id), {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}
