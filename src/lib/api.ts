const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Auto-sync token with backend when user is logged in
async function getOrSyncToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('studiospace_token');
  if (token) return token;

  // If token is missing but user profile is in localStorage, auto-sync with backend
  try {
    const userStr = localStorage.getItem('studiospace_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.email) {
        const syncRes = await fetch(`${API_BASE_URL}/api/auth/social-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            photoURL: user.photoURL,
          }),
        });
        const syncData = await syncRes.json();
        if (syncData?.success && syncData?.token) {
          localStorage.setItem('studiospace_token', syncData.token);
          return syncData.token;
        }
      }
    }
  } catch (err) {
    console.warn('Auto-token sync error:', err);
  }

  return null;
}

export async function apiRequest<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  let token = typeof window !== 'undefined' ? localStorage.getItem('studiospace_token') : null;
  if (!token && typeof window !== 'undefined') {
    token = await getOrSyncToken();
  }

  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  let res = await fetch(url, {
    cache: rest.cache || 'no-store',
    ...rest,
    credentials: 'include', // sends HTTPOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...headers,
    },
  });

  // If 401 Unauthorized occurs, try token re-sync once and retry request
  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('studiospace_token');
    const freshToken = await getOrSyncToken();
    if (freshToken) {
      res = await fetch(url, {
        cache: rest.cache || 'no-store',
        ...rest,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${freshToken}`,
          ...headers,
        },
      });
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  get: <T = any>(url: string, params?: Record<string, any>) =>
    apiRequest<T>(url, { method: 'GET', params }),

  post: <T = any>(url: string, body?: any) =>
    apiRequest<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),

  put: <T = any>(url: string, body?: any) =>
    apiRequest<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

  patch: <T = any>(url: string, body?: any) =>
    apiRequest<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),

  delete: <T = any>(url: string) =>
    apiRequest<T>(url, { method: 'DELETE' }),
};
