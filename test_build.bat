@echo off
echo ========================================
echo LunaLite Engine - Test Build
echo ========================================
echo.

REM Set up Visual Studio environment
call "C:\Program Files\Microsoft Visual Studio\18\Community\VC\Auxiliary\Build\vcvars64.bat" >nul 2>&1

echo [1/3] Compiling test executable...
cl.exe /EHsc /std:c++17 /I. test_engine.cpp /link build_compiled\lib\LunaLite_Engine.lib /OUT:test_engine.exe

if %ERRORLEVEL% EQU 0 (
    echo [2/3] Compilation successful!
    echo.
    echo [3/3] Running tests...
    echo ========================================
    test_engine.exe
    echo ========================================
    echo.
    if %ERRORLEVEL% EQU 0 (
        echo SUCCESS: All tests passed!
    ) else (
        echo FAILED: Tests encountered errors
    )
) else (
    echo FAILED: Compilation errors occurred
    echo.
    echo Note: This may be expected if the library requires
    echo additional dependencies or initialization code.
)

echo.
pause
