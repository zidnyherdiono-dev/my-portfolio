# ============================================================
# WATCHDOG portofolio v2 — perbaikan otomatis + lapor URL berubah
# (no_agent cronjob): output = notifikasi, diam = sehat & URL sama
#
# Perbaikan v2:
#  - Tidak memanggil cmd /c pada path ber-spasi (bug hang 3600s)
#    -> spawn proses langsung via Popen (node, npm via cmd tanpa kutip, cloudflared exe)
#  - Deteksi PERUBAHAN URL tunnel via state file (auto/last-url.txt)
#    -> URL baru selalu dilaporkan walau layanan sehat
# ============================================================
import re
import os
import time
import subprocess
import urllib.request

DIR = r"C:\Users\Zidny Ilham Herdiono\my-portfolio"
LOG = os.path.join(DIR, "tunnel.log")
STATE = os.path.join(DIR, "auto", "last-url.txt")
CF = r"C:\Users\Zidny Ilham Herdiono\bin\cloudflared.exe"
DETACHED = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS


def up(url):
    try:
        with urllib.request.urlopen(url, timeout=10) as r:
            return r.status == 200
    except Exception:
        return False


def spawn(args, logfile):
    f = open(logfile, "ab")
    subprocess.Popen(args, cwd=DIR, stdout=f, stderr=subprocess.STDOUT,
                     creationflags=DETACHED)
    f.close()


def start_vite():
    spawn(["cmd", "/c", "npm run dev -- --host --port 5173"], os.path.join(DIR, "vite.log"))


def start_api():
    spawn(["node", "server\\index.js"], os.path.join(DIR, "api.log"))


def start_tunnel():
    # "wb" = truncate log supaya URL lama tidak tertukar
    f = open(LOG, "wb")
    subprocess.Popen([CF, "tunnel", "--url", "http://localhost:5173"],
                     cwd=DIR, stdout=f, stderr=subprocess.STDOUT,
                     creationflags=DETACHED)
    f.close()


def tunnel_url():
    try:
        txt = open(LOG, encoding="utf-8", errors="ignore").read()
        m = re.findall(r"https://[a-z0-9-]+\.trycloudflare\.com", txt)
        return m[-1] if m else None
    except Exception:
        return None


fixed = []

# 1. Frontend Vite (5173)
if not up("http://localhost:5173"):
    start_vite()
    fixed.append("Vite(5173)")
    time.sleep(12)

# 2. Backend API (3001)
if not up("http://localhost:3001/api/stats"):
    start_api()
    fixed.append("API(3001)")
    time.sleep(6)

# 3. Cloudflare Tunnel
url = tunnel_url()
if not (url and up(url)):
    subprocess.run(["taskkill", "/F", "/IM", "cloudflared.exe"], capture_output=True)
    time.sleep(2)
    start_tunnel()
    fixed.append("Tunnel")
    time.sleep(30)
    url = tunnel_url()

# 4. Deteksi perubahan URL (state file)
old = None
try:
    old = open(STATE, encoding="utf-8").read().strip()
except Exception:
    pass
if url:
    with open(STATE, "w", encoding="utf-8") as f:
        f.write(url)

# Laporan:
#  - ada perbaikan ATAU URL berubah -> kirim
#  - sehat + URL sama -> diam
if fixed:
    print("PERBAIKAN OTOMATIS portofolio: " + ", ".join(fixed) + " dijalankan ulang.")
    print("URL publik: " + (url or "(belum muncul - dicek lagi 20 menit)"))
elif url and old and url != old:
    print("URL portofolio BERUBAH (layanan sehat, URL baru):")
    print(url)
elif url and not old:
    print("URL portofolio aktif (baseline watchdog):")
    print(url)
