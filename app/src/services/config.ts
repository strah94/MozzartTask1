export const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "";
if (!import.meta.env.VITE_API_GATEWAY_URL) {
  console.warn("VITE_API_GATEWAY_URL environment variable is not set");
}
