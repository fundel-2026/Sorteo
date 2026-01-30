@echo off
echo ===================================================
echo   INICIANDO SISTEMA DE SORTEO (SERVIDOR)
echo ===================================================
echo.
echo 1. Instalando librerias necesarias (solo la primera vez)...
call npm install
echo.
echo 2. Construyendo aplicacion frontend...
call npm run build
echo.
echo 3. Arrancando servidor y base de datos...
echo.
echo    IMPORTANTE: NO CIERRES ESTA VENTANA NEGRA.
echo.
echo    - Registro:   http://localhost:3000
echo    - Admin:      http://localhost:3000/admin.html
echo.
start http://localhost:3000/admin.html
start http://localhost:3000
echo Iniciando...
node server.js
pause
