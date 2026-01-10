@echo off
echo ========================================
echo Starting COD System Backend
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Java version...
java -version
echo.

echo Starting Spring Boot application...
echo Please wait, this may take 30-60 seconds...
echo.

mvn spring-boot:run

pause
