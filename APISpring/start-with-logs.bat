@echo off
echo Iniciando aplicacion con logging...
cd /d "c:\Users\rosma\OneDrive\Escritorio\DWF\BancoAgriculturaSalvadoreno\APISpring"
mvn spring-boot:run > app-logs.txt 2>&1
