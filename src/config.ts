export const API_URL: string = import.meta.env.VITE_API_URL ?? "";

/** Serve every API call from the bundled JSON seed instead of the real backend. */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true" || !API_URL;
