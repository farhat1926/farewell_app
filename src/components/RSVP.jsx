import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, CircleAlert, RefreshCw, UserRoundCheck, UsersRound } from 'lucide-react';
import { event } from '../data/event';
import { fetchGuests, isGuestbookConfigured, submitGuest } from '../services/guestbook';
import Reveal from './Reveal';

const STATUS = ['Hadir', 'Belum bisa memastikan', 'Maaf, tidak bisa hadir'];
const statusClass = status => status === 'Hadir' ? 'confirmed' : status === STATUS[1] ? 'pending' : 'declined';

export default function RSVP() {
  const [name, setName] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const [attendance, setAttendance] = useState(STATUS[0]);
  const [guests, setGuests] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(isGuestbookConfigured);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('Semua');

  const refresh = useCallback(async () => {
    if (!isGuestbookConfigured) return;
    setLoading(true);
    setError('');
    try { setGuests(await fetchGuests()); }
    catch (err) { setError(err.message || 'Gagal memuat daftar tamu.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  const attending = useMemo(() => guests.filter(g => g.attendance === 'Hadir').length, [guests]);
  const displayed = useMemo(() => filter === 'Semua' ? guests : guests.filter(g => g.attendance === filter), [guests, filter]);

  async function onSubmit(e) {
    e.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (cleanName.length < 2) { setError('Nama minimal 2 karakter.'); return; }
    if (!isGuestbookConfigured) { setError('Google Sheets belum dihubungkan oleh penyelenggara.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { guests: updated, id } = await submitGuest({ name: cleanName, attendance });
      setGuests(updated);
      setHighlightId(id);
      setName('');
      setFilter('Semua');
      setNotice(`Terima kasih! Konfirmasi ${cleanName} sudah tersimpan di Google Sheets.`);
    } catch (err) { setError(err.message || 'Gagal menyimpan konfirmasi.'); }
    finally { setBusy(false); }
  }

  return <section className="section rsvp" id="rsvp">
    <Reveal className="rsvp-inner">
      <p className="eyebrow">// YOUR PRESENCE MATTERS</p>
      <h2 className="section-title">SAVE YOUR <em>SEAT.</em></h2>
      <p className="section-lead">Kursi sudah kami siapkan. Isi konfirmasi di bawah dan namamu akan muncul dalam daftar tamu.</p>
      <form onSubmit={onSubmit} className="rsvp-form">
        <label htmlFor="guest-name">YOUR NAME</label>
        <input id="guest-name" value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" maxLength={80} minLength={2} autoComplete="name" required disabled={busy} />
        <label htmlFor="attendance">ATTENDANCE STATUS</label>
        <select id="attendance" value={attendance} onChange={e => setAttendance(e.target.value)} disabled={busy}>
          {STATUS.map(status => <option key={status}>{status}</option>)}
        </select>
        <button className="button button-primary" type="submit" disabled={busy || !isGuestbookConfigured}>
          {busy ? <><RefreshCw size={17} className="spin-icon"/> MENYIMPAN...</> : <><UserRoundCheck size={17}/> SAVE MY SEAT <ArrowUpRight size={17}/></>}
        </button>
      </form>
      <p className="rsvp-note">{event.rsvpDeadline} · Nama dan status kehadiran akan tampil secara publik pada undangan ini.</p>
      {!isGuestbookConfigured && <p className="form-notice guestbook-warning" role="status"><CircleAlert size={17}/> Mode belum terhubung: isi <code>googleScriptUrl</code> pada <code>src/data/event.js</code> sesuai README.</p>}
      {notice && <p className="form-notice" role="status"><CheckCircle2 size={17}/>{notice}</p>}
      {error && <p className="form-notice guestbook-error" role="alert"><CircleAlert size={17}/>{error}</p>}
    </Reveal>

    <Reveal className="guestbook" id="guestbook">
      <div className="guestbook-title-row">
        <div className="guestbook-heading"><p className="guestbook-kicker">// LIVE GUEST MANIFEST</p><h3>THE <span>GUEST LIST.</span></h3><p>Nama dan konfirmasi yang sudah tersimpan.</p></div>
        <button className="guestbook-refresh" type="button" onClick={refresh} disabled={loading || busy || !isGuestbookConfigured} aria-label="Muat ulang daftar tamu"><RefreshCw size={16} className={loading ? 'spin-icon' : ''}/> REFRESH</button>
      </div>
      <div className="guestbook-stats"><div><UsersRound size={19}/><strong>{guests.length}</strong><span>TOTAL RSVP</span></div><div><UserRoundCheck size={19}/><strong>{attending}</strong><span>HADIR</span></div></div>
      <div className="guestbook-filters" role="group" aria-label="Filter daftar tamu">
        {['Semua', ...STATUS].map(status => <button key={status} type="button" aria-pressed={filter === status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>{status}</button>)}
      </div>
      <div className="guestbook-list" aria-live="polite">
        {loading ? <div className="guestbook-empty"><RefreshCw size={23} className="spin-icon"/> Memuat daftar tamu dari spreadsheet...</div> : !isGuestbookConfigured ? <div className="guestbook-empty">Hubungkan Google Sheets untuk menampilkan daftar RSVP secara langsung.</div> : displayed.length === 0 ? <div className="guestbook-empty">{guests.length ? 'Belum ada tamu untuk status ini.' : 'Belum ada RSVP. Jadilah yang pertama!'}</div> : displayed.map((guest, index) => <div className={`guestbook-item ${guest.id === highlightId ? 'guest-new' : ''}`} key={guest.id}>
          <div className="guestbook-avatar">{guest.name.trim().slice(0, 1).toUpperCase()}</div>
          <div className="guestbook-person"><strong className="guest-glow-name">{guest.name}</strong><small>GUEST // {String(index + 1).padStart(3, '0')}</small></div>
          <span className={`guestbook-status ${statusClass(guest.attendance)}`}>{guest.attendance}</span>
        </div>)}
      </div>
    </Reveal>
  </section>;
}
