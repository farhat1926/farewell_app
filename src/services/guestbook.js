// Apps Script Web App exposes a JSONP read endpoint and an append-only POST endpoint.
// Submission is confirmed ONLY after the new row is visible on the spreadsheet.
import { event } from '../data/event';

export const isGuestbookConfigured = /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(event.googleScriptUrl || '');
const endpoint = event.googleScriptUrl;
const TIMEOUT_MS = 12000;

export function fetchGuests() {
  if (!isGuestbookConfigured) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const cb = '__farewellGuests_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    let completed = false;
    const cleanup = () => { clearTimeout(timer); script.remove(); delete window[cb]; };
    const finish = (err, result) => { if (completed) return; completed = true; cleanup(); err ? reject(err) : resolve(result); };
    window[cb] = (payload) => {
      if (!payload || !payload.ok || !Array.isArray(payload.guests)) {
        finish(new Error(payload?.error || 'Daftar tamu belum dapat dimuat.'));
      } else {
        finish(null, payload.guests);
      }
    };
    const timer = setTimeout(() => finish(new Error('Koneksi daftar tamu habis waktu.')), TIMEOUT_MS);
    script.onerror = () => finish(new Error('Gagal terhubung ke Google Sheets. Periksa URL deployment.'));
    const url = new URL(endpoint);
    url.searchParams.set('action', 'list');
    url.searchParams.set('callback', cb);
    url.searchParams.set('_', String(Date.now()));
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

export async function submitGuest({ name, attendance }) {
  if (!isGuestbookConfigured) throw new Error('Hubungkan Google Sheets terlebih dahulu.');
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  // Apps Script redirects responses; a no-cors POST avoids browser CORS rejection.
  // An opaque response is NOT proof of successful storage, so verify through read endpoint.
  await fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ id, name, attendance }),
  });
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 700 : 1400));
    try {
      const guests = await fetchGuests();
      if (guests.some(guest => guest.id === id)) return { guests, id };
    } catch {
      // Retry transient propagation/network errors; do not silently claim success.
    }
  }
  throw new Error('Belum dapat memverifikasi penyimpanan. Klik Muat ulang daftar sebelum mengirim lagi agar tidak terjadi duplikasi.');
}
