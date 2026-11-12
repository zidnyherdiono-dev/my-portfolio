# ============================================================
# PROJECTS-SYNC — sinkronisasi status publikasi portofolio
# (cronjob Hermes no_agent): output = notifikasi, diam = tanpa perubahan
#
# Alur: tombol "Publikasikan" di website -> /api/project-status (server Vercel)
#       -> script ini membacanya -> update src/data/projects.tsx -> deploy ulang
# Hasil: status publikasi permanen di kode (bukan storage sementara).
# ============================================================
import json
import re
import subprocess
import urllib.request

LIVE = "https://zidny-portfolio.vercel.app"
KEY = "zidny123"  # kunci admin (env ADMIN_KEY di server)
DIR = r"C:\Users\Zidny Ilham Herdiono\my-portfolio"
DATA = DIR + r"\src\data\projects.tsx"


def api(path):
    req = urllib.request.Request(LIVE + path, headers={"x-admin-key": KEY})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def local_status(text):
    out = {}
    ids = [(m.group(1), m.start()) for m in re.finditer(r'id: "([^"]+)"', text)]
    for i, (pid, start) in enumerate(ids):
        end = ids[i + 1][1] if i + 1 < len(ids) else len(text)
        sm = re.search(r'status: "(draft|published)"', text[start:end])
        if sm:
            out[pid] = sm.group(1)
    return out


# 1. Ambil status override dari server (diam jika API tidak bisa dihubungi)
try:
    remote = api("/api/project-status").get("status", {})
except Exception:
    raise SystemExit(0)

text = open(DATA, encoding="utf-8").read()
local = local_status(text)
changed = []

# 2. Bandingkan & patch projects.tsx
for pid, status in remote.items():
    if pid in local and local[pid] != status:
        idx = text.find(f'id: "{pid}"')
        seg_end = text.find("\n  },", idx)
        seg = text[idx:seg_end]
        new_seg = re.sub(r'status: "(draft|published)"', f'status: "{status}"', seg, count=1)
        text = text[:idx] + new_seg + text[seg_end:]
        changed.append(f"{pid} -> {status}")

if not changed:
    raise SystemExit(0)

open(DATA, "w", encoding="utf-8").write(text)
print("PERUBAHAN PUBLIKASI PORTOFOLIO: " + "; ".join(changed))

# 3. Build + deploy ulang website portofolio
r1 = subprocess.run(["cmd", "/c", "npm run build"], cwd=DIR, timeout=600)
if r1.returncode != 0:
    print("ERROR: build gagal — perubahan tersimpan lokal tapi belum live.")
    raise SystemExit(1)
r2 = subprocess.run(["cmd", "/c", "npx vercel deploy --prod --yes"], cwd=DIR, timeout=600)
if r2.returncode != 0:
    print("ERROR: deploy gagal — jalankan manual: cd my-portfolio && npx vercel deploy --prod --yes")
    raise SystemExit(1)
print("LIVE: " + LIVE)
