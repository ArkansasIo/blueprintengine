@echo off
REM LunaLite Direct Compilation Script
REM Compiles all C++ files directly using cl.exe without CMake

setlocal enabledelayedexpansion

REM Set paths
set VSDIR=C:\Program Files\Microsoft Visual Studio\18\Community
set VC_TOOLS=%VSDIR%\VC\Tools\MSVC\14.50.35717
set VCVARS=%VSDIR%\VC\Auxiliary\Build\vcvars64.bat

REM Initialize VC environment
call "%VCVARS%" >nul

REM Set build directory
set SRCDIR=%CD%\cpp_src
set BUILDDIR=%CD%\build_compiled
set OBJDIR=%BUILDDIR%\obj
set LIBDIR=%BUILDDIR%\lib

REM Clean and create directories
if exist "%BUILDDIR%" rmdir /s /q "%BUILDDIR%"
mkdir "%OBJDIR%"
mkdir "%LIBDIR%"

echo.
echo ======================================================
echo  LunaLite Engine - Direct Compilation
echo ======================================================
echo.

REM Compile all CPP files
echo Compiling C++ files...
set COMPILE_COUNT=0
set ERROR_COUNT=0

for /r "%SRCDIR%" %%f in (*.cpp) do (
    if not "%%~nf"=="main.cpp" (
        set /a COMPILE_COUNT+=1
        REM Skip APIGUIWindow.cpp as it requires Qt
        if not "%%~nf"=="APIGUIWindow.cpp" (
            echo   [!COMPILE_COUNT!] Compiling: %%~nf
            cl.exe /W0 /EHsc /std:c++17 /c "%%f" /Fo"%OBJDIR%\%%~nf.obj" /I"%SRCDIR%" 2>nul
            if !ERRORLEVEL! neq 0 (
                set /a ERROR_COUNT+=1
                echo     ERROR: Failed to compile %%~nf
            )
        )
    )
)

echo.
echo Compiling main.cpp...
cl.exe /W0 /EHsc /std:c++17 /c "%SRCDIR%\main.cpp" /Fo"%OBJDIR%\main.cpp.obj" /I"%SRCDIR%" 2>nul

echo.
echo ======================================================
echo  Compilation Summary
echo ======================================================
echo Files processed: !COMPILE_COUNT!
echo Errors: !ERROR_COUNT!
echo Object files directory: %OBJDIR%
echo.

REM Create library
echo Creating static library...
set "ALLOBJ="
for %%f in ("%OBJDIR%\*.obj") do (
    set "ALLOBJ=!ALLOBJ! "%%f""
)

lib.exe /OUT:"%LIBDIR%\LunaLite_Engine.lib" !ALLOBJ! 2>nul

if exist "%LIBDIR%\LunaLite_Engine.lib" (
    echo   SUCCESS: Library created: %LIBDIR%\LunaLite_Engine.lib
    for %%z in ("%LIBDIR%\LunaLite_Engine.lib") do echo   Size: %%~zz bytes
) else (
    echo   ERROR: Failed to create library
)

echo.
echo Build complete!
echo.
pause
