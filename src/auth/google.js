// Lightweight Google OAuth helper using Google Identity Services (GIS)
let tokenClient = null;
let accessToken = null;
let grantedScopes = new Set();

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function initTokenClient(scopes) {
  if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    console.warn("Google Identity Services script not yet loaded.");
    return null;
  }
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: scopes.join(' '),
    prompt: '',
    callback: (tokenResponse) => {
      accessToken = tokenResponse.access_token;
      // Track granted scopes for future checks
      scopes.forEach(s => grantedScopes.add(s));
      // Persist temporarily
      sessionStorage.setItem('google_access_token', accessToken);
      sessionStorage.setItem('google_scopes', JSON.stringify(Array.from(grantedScopes)));
    },
  });
  return tokenClient;
}

export async function ensureToken(scopes) {
  const needed = Array.isArray(scopes) ? scopes : [scopes];
  // If we already have a token and scopes include all needed, return
  const saved = sessionStorage.getItem('google_access_token');
  const savedScopes = JSON.parse(sessionStorage.getItem('google_scopes') || '[]');
  const hasAll = needed.every(s => savedScopes.includes(s));

  if (saved && hasAll) {
    accessToken = saved;
    grantedScopes = new Set(savedScopes);
    return accessToken;
  }

  // Request/refresh token
  await new Promise((resolve, reject) => {
    function requestToken() {
      if (!tokenClient) {
        tokenClient = initTokenClient(needed);
        if (!tokenClient) {
          // wait for GIS script
          setTimeout(requestToken, 300);
          return;
        }
      }
      tokenClient.callback = (resp) => {
        if (resp.error) {
          reject(resp);
          return;
        }
        accessToken = resp.access_token;
        sessionStorage.setItem('google_access_token', accessToken);
        const merged = new Set([...(JSON.parse(sessionStorage.getItem('google_scopes') || '[]')), ...needed]);
        sessionStorage.setItem('google_scopes', JSON.stringify(Array.from(merged)));
        resolve(accessToken);
      };
      tokenClient.requestAccessToken();
    }
    requestToken();
  });

  return accessToken;
}

export function getAccessTokenSync() {
  return accessToken || sessionStorage.getItem('google_access_token') || null;
}

export function revokeToken() {
  const token = getAccessTokenSync();
  if (!token) return;
  if (window.google && window.google.accounts && window.google.accounts.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {
      accessToken = null;
      sessionStorage.removeItem('google_access_token');
      sessionStorage.removeItem('google_scopes');
    });
  } else {
    accessToken = null;
    sessionStorage.removeItem('google_access_token');
    sessionStorage.removeItem('google_scopes');
  }
}

export const SCOPES = {
  calendar: [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly'
  ],
  gmail: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
  ],
  tasks: ['https://www.googleapis.com/auth/tasks']
};
