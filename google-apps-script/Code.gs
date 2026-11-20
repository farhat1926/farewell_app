/**
 * Google Sheets-bound Apps Script for Farewell RSVP.
 * Deploy as Web App: Execute as Me / Who has access: Anyone.
 * WARNING: Everyone with the public invitation URL can read the guest list.
 * Do not store private contact details in this sheet.
 */
const SHEET_NAME = 'RSVP';
const HEADERS = ['ID', 'Tanggal Konfirmasi', 'Nama Tamu', 'Status Kehadiran'];
const ALLOWED = ['Hadir', 'Belum bisa memastikan', 'Maaf, tidak bisa hadir'];

function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Skrip harus dibuat dari Ekstensi > Apps Script di dalam Google Sheets.');
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange('B:B').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.setColumnWidths(1, 4, 190);
  }
  return sheet;
}

function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  // Strict callback validation to keep the JSONP endpoint a valid JS response.
  if (!/^__farewellGuests_[A-Za-z0-9_]+$/.test(callback)) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:'Invalid callback'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    const sheet = sheet_();
    const last = sheet.getLastRow();
    const data = last > 1 ? sheet.getRange(2, 1, last - 1, 4).getValues() : [];
    const guests = data.reverse().map(row => ({
      id: String(row[0]),
      name: String(row[2]),
      attendance: String(row[3]),
    }));
    return ContentService.createTextOutput(callback + '(' + JSON.stringify({ok:true,guests}) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch (err) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify({ok:false,error:String(err.message)}) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const id = String(data.id || '');
    const name = String(data.name || '').trim().replace(/\s+/g, ' ');
    const attendance = String(data.attendance || '');
    if (!/^[\w-]{8,80}$/.test(id)) throw new Error('ID tidak valid.');
    if (name.length < 2 || name.length > 80) throw new Error('Nama harus 2–80 karakter.');
    if (!ALLOWED.includes(attendance)) throw new Error('Status tidak valid.');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = sheet_();
      const last = sheet.getLastRow();
      if (last > 1) {
        const priorIds = sheet.getRange(2, 1, last - 1, 1).getValues();
        if (priorIds.some(row => String(row[0]) === id)) {
          return json_({ok:true,id,duplicate:true});
        }
      }
      // Escape spreadsheet formula-like input rather than execute it as a formula.
      const safeName = /^[=+\-@]/.test(name) ? "'" + name : name;
      sheet.appendRow([id, new Date(), safeName, attendance]);
      return json_({ok:true,id});
    } finally { lock.releaseLock(); }
  } catch (err) { return json_({ok:false,error:String(err.message)}); }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
