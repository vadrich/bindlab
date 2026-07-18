@echo off
cd /d "%~dp0"
node scripts\deploy-firebase.mjs
if errorlevel 1 pause
