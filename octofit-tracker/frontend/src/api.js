// Centralized API base URL logic

// Codespace environment variable (set in .env or Codespace settings)
const codespaceName = process.env.REACT_APP_CODESPACE_NAME;

// Always use http:// for backend API, even if public URL is https://
export const API_BASE_URL = `https://${codespaceName}-8000.app.github.dev/api/`;

// Helper to build full API endpoint
export function apiEndpoint(path) {
  return `${API_BASE_URL}${path.replace(/^\//, '')}`;
}
