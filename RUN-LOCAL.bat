@echo off
setlocal
cd /d "%~dp0"

if not exist "dev-server.py" (
  echo Keep RUN-LOCAL.bat in the extracted Support Fins folder with dev-server.py.
  pause
  exit /b 1
)

py -3 --version >nul 2>nul
if not errorlevel 1 (
  start "Support Fins Local Server" cmd /k "py -3 dev-server.py"
  goto open_browser
)
python --version >nul 2>nul
if not errorlevel 1 (
  start "Support Fins Local Server" cmd /k "python dev-server.py"
  goto open_browser
)
python3 --version >nul 2>nul
if not errorlevel 1 (
  start "Support Fins Local Server" cmd /k "python3 dev-server.py"
  goto open_browser
)

echo Python 3 was not found. Install Python 3 and run this launcher again.
pause
exit /b 1

:open_browser
echo Starting Support Fins at http://localhost:8731/
echo Keep the server window open while using the site.
timeout /t 2 /nobreak >nul
start "" "http://localhost:8731/"
