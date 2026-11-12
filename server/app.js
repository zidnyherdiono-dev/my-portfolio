// ============================================================
// BACKEND EXPRESS — API untuk website portofolio (full-stack)
// Penyimpanan pesan: file JSON lokal (data/messages.json)
// ============================================================
import express from 'express';
import { put, get } from '@vercel/blob';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Di Vercel filesystem hanya bisa ditulis di /tmp (pesan tidak persisten antar-deploy)
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'portfolio-data')
  : path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'messages.json');

// Kunci admin untuk melihat pesan — HANYA dari environment variable ADMIN_KEY.
// Development: taruh di file .env (tidak ikut ter-commit). Production: set di Vercel.
try { process.loadEnvFile(); } catch { /* tidak ada .env — pakai environment sistem */ }
const ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) {
  console.warn("PERINGATAN: ADMIN_KEY belum diset — endpoint admin akan menolak semua akses.");
}

const app = express();
app.use(express.json());

// Header CORS sederhana (agar API bisa dipanggil dari mana pun saat pengembangan)
app.use('/api', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---- Helper penyimpanan ----
function readMessages() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function writeMessages(messages) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

// ---- ROUTES API ----

// POST /api/contact — terima pesan dari formulir kontak
app.post('/api/contact', (req, res) => {
  const { name, message } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.length > 100) {
    return res.status(400).json({ ok: false, error: 'Nama wajib diisi (maks 100 karakter).' });
  }
  if (typeof message !== 'string' || !message.trim() || message.length > 2000) {
    return res.status(400).json({ ok: false, error: 'Pesan wajib diisi (maks 2000 karakter).' });
  }
  const messages = readMessages();
  const entry = {
    id: Date.now(),
    name: name.trim().slice(0, 100),
    message: message.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
  };
  messages.push(entry);
  writeMessages(messages);
  console.log(`[contact] pesan baru dari ${entry.name} (#${entry.id})`);
  res.json({ ok: true, id: entry.id });
});

// GET /api/messages — daftar pesan (butuh header x-admin-key)
app.get('/api/messages', (req, res) => {
  const key = req.get('x-admin-key');
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Kunci admin salah.' });
  }
  const messages = readMessages().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ ok: true, messages });
});

// GET /api/stats — statistik publik (jumlah pesan)
app.get('/api/stats', (req, res) => {
  res.json({ ok: true, totalMessages: readMessages().length });
});

// DELETE /api/messages/:id — hapus satu pesan (butuh header x-admin-key)
app.delete('/api/messages/:id', (req, res) => {
  const key = req.get('x-admin-key');
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Kunci admin salah.' });
  }
  const id = Number(req.params.id);
  const messages = readMessages();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) {
    return res.status(404).json({ ok: false, error: 'Pesan tidak ditemukan.' });
  }
  writeMessages(next);
  res.json({ ok: true });
});

// ---- Status publikasi proyek portofolio (tombol publikasi admin) ----
// Disimpan di Vercel Blob (persisten antar-instance). Fallback file lokal saat development.
const STATUS_BLOB = 'project-status.json';
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;
const STATUS_FILE = path.join(DATA_DIR, 'project-status.json');

async function readStatus() {
  if (!USE_BLOB) {
    try {
      return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
    } catch {
      return {};
    }
  }
  try {
    const res = await get(STATUS_BLOB, { access: 'private', type: 'text', consistency: 'strong' });
    const r = await fetch(res.blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    return JSON.parse(await r.text());
  } catch (e) {
    if (e && e.name === 'BlobNotFoundError') return {};
    throw e;
  }
}

async function writeStatus(all) {
  if (!USE_BLOB) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(STATUS_FILE, JSON.stringify(all, null, 2), 'utf8');
    return;
  }
  await put(STATUS_BLOB, JSON.stringify(all, null, 2), { allowOverwrite: true, access: 'private' });
}

// GET /api/project-status — status publikasi terkini (butuh kunci admin)
app.get('/api/project-status', async (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Kunci admin salah.' });
  }
  try {
    res.json({ ok: true, status: await readStatus() });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Gagal membaca status.' });
  }
});

// POST /api/project-status — ubah status publikasi {id, status: draft|published} (butuh kunci admin)
app.post('/api/project-status', async (req, res) => {
  if (!ADMIN_KEY || req.get('x-admin-key') !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Kunci admin salah.' });
  }
  const { id, status } = req.body || {};
  if (typeof id !== 'string' || !['draft', 'published'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'Data tidak valid.' });
  }
  try {
    const all = await readStatus();
    all[id] = status;
    await writeStatus(all);
    console.log(`[project-status] ${id} -> ${status}`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Gagal menyimpan status.', detail: String(e) });
  }
});

// ---- Mode produksi: sajikan hasil build React (folder dist) ----
const DIST = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

export default app;
