@echo off
REM ============================================================
REM  JALANKAN SEMUA LAYANAN PORTOFOLIO (idempoten per komponen)
REM  Pemakaian: start-portfolio.bat [api|vite|tunnel|all]
REM ============================================================
set ARG=%1
if "%ARG%"=="" set ARG=all

if "%ARG%"=="all" goto :all
if "%ARG%"=="api" goto :api
if "%ARG%"=="vite" goto :vite
if "%ARG%"=="tunnel" goto :tunnel
goto :eof

:all
start "PORTO-API" /min cmd /c "C:\Users\Zidny Ilham Herdiono\my-portfolio\auto\api.bat"
start "PORTO-VITE" /min cmd /c "C:\Users\Zidny Ilham Herdiono\my-portfolio\auto\vite.bat"
start "PORTO-TUNNEL" /min cmd /c "C:\Users\Zidny Ilham Herdiono\my-portfolio\auto\tunnel.bat"
echo Semua layanan dijalankan. URL publik ada di tunnel.log
goto :eof

:api
start "PORTO-API" /min cmd /c "C:\Users\Zidny Ilham Herdiono\my-portfolio\auto\api.bat"
echo API dijalankan.
goto :eof

:vite
start "PORTO-VITE" /min cmd /c "C:\Users\Zidny Ilham Herdiono\my-portfolio\auto\vite.bat"
echo Vite dijalankan.
goto :eof

:tunnel
start "PORTO-TUNNEL" /min cmd /c "C:\Users\Zidny Ilham Herdiono\my-portfolio\auto\tunnel.bat"
echo Tunnel dijalankan.
goto :eof
