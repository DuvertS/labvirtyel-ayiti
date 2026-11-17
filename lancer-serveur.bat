@echo off
REM LabVirtyel Ayiti - lance un petit serveur local pour tester l'application installable.
REM Ouvrez ensuite http://localhost:8000 dans Chrome ou Edge.
cd /d "%~dp0"
echo.
echo  LabVirtyel Ayiti : http://localhost:8000
echo  (fermez cette fenetre pour arreter le serveur)
echo.
start "" http://localhost:8000/index.html
python -m http.server 8000
