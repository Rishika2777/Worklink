import axios from "axios";

/**
 * Dev: baseURL "" → requests go to localhost:5173/api/... → Vite proxy → backend (avoids CORS).
 * Prod: set VITE_API_BASE_URL or falls back to the ngrok URL below.
 */
const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? "" : "https://collin-humpless-patria.ngrok-free.dev"),
});

export default API;