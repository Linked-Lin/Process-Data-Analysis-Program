@echo off
chcp 65001 >nul
setlocal
title 制程能力分析工具 - 便携版一键打包
cd /d "%~dp0"

REM ===== 国内镜像加速（下载 Electron / 7z 二进制）=====
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

where node >nul 2>nul || (echo [错误] 未检测到 Node.js，请先安装 Node 18+：https://nodejs.org/zh-cn & pause & exit /b 1)

echo.
echo ========== [1/5] 生成工程 + 补丁 + 图标 ==========
node setup-project.js || goto :fail

echo.
echo ========== [2/5] 安装依赖（首次约 5-10 分钟，请耐心等待） ==========
call npm install --no-audit --no-fund || goto :fail

echo.
echo ========== [3/5] 拷贝离线库到 renderer/vendor ==========
node tools\copy-vendor.js || goto :fail

echo.
echo ========== [4/5] 打包便携版 exe ==========
call npx electron-builder --win portable || goto :fail

echo.
echo ========== [5/5] 完成 ==========
for %%f in (release\*.exe) do echo   产物：%%~ff
start "" explorer release
pause & exit /b 0

:fail
echo.
echo  ❌ 构建失败：请把本窗口日志保存后反馈排查
pause & exit /b 1