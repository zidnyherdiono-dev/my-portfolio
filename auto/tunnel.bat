@echo off
REM === Cloudflare Tunnel (URL publik, log ke tunnel.log) ===
cd /d C:\Users\Zidny Ilham Herdiono\my-portfolio
> tunnel.log 2>&1 (
  "C:\Users\Zidny Ilham Herdiono\bin\cloudflared.exe" tunnel --url http://localhost:5173
)
