@echo off
REM LunaLite Build Script for Windows CMD
REM This script automates the build process for the LunaLite game engine

setlocal enabledelayedexpansion

REM Get project paths
set "PROJECT_ROOT=%CD%"
set "CPP_SRC=%PROJECT_ROOT%\cpp_src"
set "BUILD_DIR=%PROJECT_ROOT%\build"

REM Parse arguments
set "CONFIGURATION=Release"
set "ENABLE_QT=OFF"
set "CLEAN_BUILD=0"

:parse_args
if "%1"=="" goto parse_done
if /i "%1"=="-config" (
    set "CONFIGURATION=%2"
    shift
    shift
    goto parse_args
)
if /i "%1"=="-qt" (
    set "ENABLE_QT=ON"
    shift
    goto parse_args
)
if /i "%1"=="-clean" (
    set "CLEAN_BUILD=1"
    shift
    goto parse_args
)
if /i "%1"=="-help" (
    goto show_help
)
shift
goto parse_args

:parse_done

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║      LunaLite Game Engine - Build Script v1.0         ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check prerequisites
echo [1/5] Checking prerequisites...

where cmake >nul 2>&1
if errorlevel 1 (
    echo.  X CMake not found. Please install from https://cmake.org/download/
    pause
    exit /b 1
)
echo.  + CMake found

where git >nul 2>&1
if errorlevel 1 (
    echo.  X Git not found.
    pause
    exit /b 1
)
echo.  + Git found

if not exist "%CPP_SRC%" (
    echo.  X Source directory not found: %CPP_SRC%
    pause
    exit /b 1
)
echo.  + Source directory found

if not exist "%CPP_SRC%\CMakeLists.txt" (
    echo.  X CMakeLists.txt not found
    pause
    exit /b 1
)
echo.  + CMakeLists.txt found

REM Clean build if requested
if %CLEAN_BUILD%==1 (
    echo.
    echo [2/5] Cleaning previous build...
    if exist "%BUILD_DIR%" (
        rmdir /s /q "%BUILD_DIR%"
        if not errorlevel 1 (
            echo.  + Build directory cleaned
        )
    ) else (
        echo.  - No previous build found
    )
) else (
    echo.
    echo [2/5] Checking build directory...
)

REM Create build directory
if not exist "%BUILD_DIR%" (
    mkdir "%BUILD_DIR%"
    echo.  + Build directory created
)
echo.  + Build directory ready: %BUILD_DIR%

REM Configure CMake
echo.
echo [3/5] Configuring CMake...
echo.  Command: cmake -DUSE_QT5=%ENABLE_QT% ../cpp_src

pushd "%BUILD_DIR%"

cmake -DUSE_QT5=%ENABLE_QT% ../cpp_src
if errorlevel 1 (
    echo.  X CMake configuration failed
    echo.
    echo  NOTE: Run this script from "Developer Command Prompt for VS"
    echo.  Search for "Developer Command Prompt" in Windows Start Menu
    popd
    pause
    exit /b 1
)
echo.  + CMake configuration successful

REM Build the project
echo.
echo [4/5] Building project ^(Configuration: %CONFIGURATION%^)...
echo.  Running: cmake --build . --config %CONFIGURATION%

cmake --build . --config %CONFIGURATION%
if errorlevel 1 (
    echo.  X Build failed
    popd
    pause
    exit /b 1
)
echo.  + Build completed successfully

REM Verify output
echo.
echo [5/5] Verifying build output...

set "EXE_PATH=%BUILD_DIR%\%CONFIGURATION%\LunaLite.exe"
if exist "%EXE_PATH%" (
    echo.  + Executable created: %EXE_PATH%
) else (
    echo.  - Executable not found
)

set "LIB_PATH=%BUILD_DIR%\%CONFIGURATION%\LunaLite_Engine.lib"
if exist "%LIB_PATH%" (
    echo.  + Library created: %LIB_PATH%
)

popd

REM Display summary
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              Build Summary                             ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Configuration:   %CONFIGURATION%
echo Qt Support:      %ENABLE_QT%
echo Build Directory: %BUILD_DIR%
echo Status:          + SUCCESS
echo.
echo Next Steps:
echo   1. Run: %BUILD_DIR%\%CONFIGURATION%\LunaLite.exe
echo   2. Open in VS: %BUILD_DIR%\LunaLite.sln
echo   3. Link library: LunaLite_Engine.lib
echo.
echo Documentation:
echo   - BUILD_INSTRUCTIONS.md    - Detailed build guide
echo   - INTEGRATION_GUIDE.md      - System integration
echo   - PROJECT_STATUS.md         - Project overview
echo.
pause
exit /b 0

:show_help
echo.
echo LunaLite Build Script
echo ====================
echo.
echo Usage: build.bat [options]
echo.
echo Options:
echo   -config Release      Build configuration: Release or Debug (default: Release)
echo   -qt                  Enable Qt5 support (default: OFF)
echo   -clean               Remove build directory and rebuild from scratch
echo   -help                Display this help message
echo.
echo Examples:
echo   build.bat                              REM Build Release without Qt
echo   build.bat -config Debug                REM Build Debug
echo   build.bat -qt                          REM Enable Qt support
echo   build.bat -clean                       REM Clean build from scratch
echo.
pause
exit /b 0
