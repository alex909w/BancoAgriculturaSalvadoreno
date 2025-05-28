@echo off
echo === REINICIANDO APLICACION SPRING BOOT ===
echo.
echo Deteniendo procesos Java existentes...
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo.
echo Iniciando aplicación corregida...
mvn spring-boot:run
