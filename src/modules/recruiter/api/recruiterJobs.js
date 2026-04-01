import API from "../../../api";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

const GET_HEADERS = {
  "ngrok-skip-browser-warning": "true",
};

/**
 * Base path for recruiter job CRUD.
 * Default matches common Spring pattern next to /api/v1/admin/...
 * If your Swagger uses another path (e.g. /api/v1/company/jobs), set in .env:
 *   VITE_RECRUITER_JOBS_API_PATH=/api/v1/company/jobs
 */
export const RECRUITER_JOBS_PATH =
  import.meta.env.VITE_RECRUITER_JOBS_API_PATH ?? "/api/v1/recruiter/jobs";

/**
 * GET — list jobs. Optional query: { status: "ACTIVE" | "CLOSED" | ... }
 */
export function getRecruiterJobs(query = {}) {
  const params = new URLSearchParams();
  if (query.status != null && query.status !== "" && query.status !== "ALL") {
    params.set("status", String(query.status));
  }
  const qs = params.toString();
  const url = qs ? `${RECRUITER_JOBS_PATH}?${qs}` : RECRUITER_JOBS_PATH;
  return API.get(url, { headers: GET_HEADERS });
}

/**
 * POST — create job (same path as list).
 */
export function createRecruiterJob(body) {
  return API.post(RECRUITER_JOBS_PATH, body, { headers: JSON_HEADERS });
}

export function normalizeJobsList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  return [];
}
