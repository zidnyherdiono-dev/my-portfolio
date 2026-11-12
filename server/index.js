// Entry point untuk menjalankan server secara lokal: node server/index.js
import app from './app.js';

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server berjalan di http://localhost:${PORT}`);
  console.log(`- POST /api/contact   (kirim pesan)`);
  console.log(`- GET  /api/messages  (admin, header x-admin-key)`);
  console.log(`- GET  /api/stats     (statistik)`);
});
