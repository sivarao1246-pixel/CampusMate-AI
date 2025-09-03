import { ensureToken, SCOPES } from '../auth/google';

async function authorizedFetch(url, options = {}, scopes = []) {
  const token = await ensureToken(scopes);
  const headers = options.headers ? { ...options.headers } : {};
  headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

/** ------- Calendar ------- **/
export async function listCalendarEvents({ timeMin = null, timeMax = null, maxResults = 10 } = {}) {
  const params = new URLSearchParams({
    calendarId: 'primary',
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: String(maxResults),
  });
  if (timeMin) params.set('timeMin', new Date(timeMin).toISOString());
  if (timeMax) params.set('timeMax', new Date(timeMax).toISOString());
  return authorizedFetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`, {}, SCOPES.calendar);
}

export async function createCalendarEvent({ summary, description, startISO, endISO, timeZone }) {
  const body = {
    summary,
    description,
    start: { dateTime: startISO, timeZone },
    end: { dateTime: endISO, timeZone },
  };
  return authorizedFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify(body),
  }, SCOPES.calendar);
}

/** ------- Gmail ------- **/
function base64UrlEncode(str) {
  const utf8 = new TextEncoder().encode(str);
  let binary = '';
  utf8.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function listGmailMessages({ maxResults = 10, query = '' } = {}) {
  const params = new URLSearchParams({ maxResults: String(maxResults) });
  if (query) params.set('q', query);
  const list = await authorizedFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`, {}, SCOPES.gmail);
  const items = list.messages || [];
  const details = await Promise.all(items.map(async (m) => {
    try {
      const d = await authorizedFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}`, {}, SCOPES.gmail);
      const headers = (d.payload?.headers || []);
      const subject = headers.find(h => h.name === 'Subject')?.value || '(no subject)';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const snippet = d.snippet || '';
      return { id: m.id, subject, from, snippet, internalDate: d.internalDate };
    } catch (e) {
      return { id: m.id, subject: '(error loading)', from: '', snippet: '' };
    }
  }));
  return details;
}

export async function sendGmail({ to, subject, body }) {
  const raw =
`To: ${to}
Subject: ${subject}
Content-Type: text/plain; charset="UTF-8"

${body}`;
  const encoded = base64UrlEncode(raw);
  return authorizedFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
    method: 'POST',
    body: JSON.stringify({ raw: encoded }),
  }, SCOPES.gmail);
}

/** ------- Google Tasks ------- **/
export async function listTasks({ tasklist = '@default', maxResults = 20 } = {}) {
  const params = new URLSearchParams({ maxResults: String(maxResults) });
  return authorizedFetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(tasklist)}/tasks?${params.toString()}`, {}, SCOPES.tasks);
}

export async function insertTask({ tasklist = '@default', title, notes = '' } = {}) {
  const body = { title, notes };
  return authorizedFetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(tasklist)}/tasks`, {
    method: 'POST',
    body: JSON.stringify(body),
  }, SCOPES.tasks);
}
