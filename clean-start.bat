@echo off
echo =======================================================
echo 🚀 TUMKUR CONNECT ENTERPRISE DEV SERVER
echo =======================================================
echo.
echo 🧹 Cleaning Next.js Cache (.next folder) to prevent 404 Chunk Errors...
IF EXIST ".next" (
    rmdir /s /q ".next"
    echo ✅ Cache cleared successfully.
) ELSE (
    echo ✅ Cache already clean.
)
echo.
echo 🌐 Starting Next.js Server...
npm run dev
