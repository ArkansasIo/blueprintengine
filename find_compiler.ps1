#!/usr/bin/env pwsh

Write-Host "=== Compiler Search ===" -ForegroundColor Cyan
Write-Host ""

# Check for MSVC
Write-Host "Checking for MSVC cl.exe..."
$msvcPath = "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC"
if (Test-Path $msvcPath) {
    Write-Host "  Found MSVC directory" -ForegroundColor Green
    $clPath = Get-ChildItem $msvcPath -Filter "cl.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($clPath) {
        Write-Host "  Found cl.exe at: $($clPath.FullName)" -ForegroundColor Green
        & $clPath.FullName 2>&1 | Select-Object -First 5
    }
} else {
    Write-Host "  MSVC not found at standard location" -ForegroundColor Yellow
}

# Check for Clang
Write-Host ""
Write-Host "Checking for Clang..."
$clangPath = Get-Command clang++ -ErrorAction SilentlyContinue
if ($clangPath) {
    Write-Host "  Found clang++: $($clangPath.Source)" -ForegroundColor Green
    clang++ --version | Select-Object -First 1
} else {
    Write-Host "  Clang not found" -ForegroundColor Yellow
}

# Check for GCC/MinGW
Write-Host ""
Write-Host "Checking for GCC/MinGW..."
$gccPath = Get-Command g++ -ErrorAction SilentlyContinue
if ($gccPath) {
    Write-Host "  Found g++: $($gccPath.Source)" -ForegroundColor Green
    g++ --version | Select-Object -First 1
} else {
    Write-Host "  GCC not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "No C++ compiler detected in system PATH or standard locations."
Write-Host ""
Write-Host "To continue compilation, install one of:"
Write-Host "  1. Visual Studio 2022 Community (recommended for Windows)"
Write-Host "     https://visualstudio.microsoft.com/vs/community/"
Write-Host "  2. LLVM/Clang"
Write-Host "     https://llvm.org/download.html"
Write-Host "  3. MinGW (GCC for Windows)"
Write-Host "     https://www.mingw-w64.org/"
