const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function getCurrentUser() {
  return sessionStorage.getItem('pin_minimal_user') || '';
}

export async function apiFetch(path, options = {}) {
  const user = getCurrentUser();
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Id': user,
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Error ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
