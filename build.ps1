#!/usr/bin/env pwsh
# LunaLite Build Script for Windows PowerShell
# This script automates the build process for the LunaLite game engine

param(
    [string]$Configuration = "Release",
    [switch]$EnableQt = $false,
    [switch]$CleanBuild = $false,
    [switch]$OpenSolution = $false,
    [switch]$HelpMessage = $false
)

# Display help
if ($HelpMessage) {
    Write-Host @"
LunaLite Build Script
====================

Usage: .\build.ps1 [options]

Options:
  -Configuration <string>   Build configuration: Release or Debug (default: Release)
  -EnableQt                 Enable Qt5 support (default: OFF)
  -CleanBuild              Remove build directory and rebuild from scratch
  -OpenSolution            Open Visual Studio solution after configuration
  -HelpMessage             Display this help message

Examples:
  .\build.ps1                                    # Build Release without Qt
  .\build.ps1 -Configuration Debug              # Build Debug
  .\build.ps1 -EnableQt -OpenSolution           # Enable Qt and open in VS
  .\build.ps1 -CleanBuild                       # Clean build from scratch

"@
    exit 0
}

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$CppSrc = Join-Path $ProjectRoot "cpp_src"
$BuildDir = Join-Path $ProjectRoot "build"
$Script:BuildSuccessful = $false

# Color output functions
function Write-Success {
    Write-Host $args -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host $args -ForegroundColor Red
}

function Write-Info {
    Write-Host $args -ForegroundColor Cyan
}

function Write-Warning-Custom {
    Write-Host $args -ForegroundColor Yellow
}

# Display header
Write-Info @"
╔════════════════════════════════════════════════════════╗
║      LunaLite Game Engine - Build Script v1.0         ║
╚════════════════════════════════════════════════════════╝
"@

# Check prerequisites
Write-Info "`n[1/5] Checking prerequisites..."

# Check CMake
try {
    $CMakeVersion = cmake --version | Select-Object -First 1
    Write-Success "  ✓ CMake installed: $CMakeVersion"
} catch {
    Write-Error-Custom "  ✗ CMake not found. Please install from https://cmake.org/download/"
    exit 1
}

# Check Git
try {
    $GitVersion = git --version
    Write-Success "  ✓ Git installed: $GitVersion"
} catch {
    Write-Error-Custom "  ✗ Git not found."
    exit 1
}

# Check source directory
if (-not (Test-Path $CppSrc)) {
    Write-Error-Custom "  ✗ Source directory not found: $CppSrc"
    exit 1
}
Write-Success "  ✓ Source directory found"

# Check CMakeLists.txt
if (-not (Test-Path "$CppSrc/CMakeLists.txt")) {
    Write-Error-Custom "  ✗ CMakeLists.txt not found in $CppSrc"
    exit 1
}
Write-Success "  ✓ CMakeLists.txt found"

# Clean build if requested
if ($CleanBuild) {
    Write-Info "`n[2/5] Cleaning previous build..."
    if (Test-Path $BuildDir) {
        Remove-Item -Recurse -Force $BuildDir -ErrorAction SilentlyContinue
        Write-Success "  ✓ Build directory cleaned"
    } else {
        Write-Info "  - No previous build found"
    }
}

# Create build directory
Write-Info "`n[2/5] Creating build directory..."
if (-not (Test-Path $BuildDir)) {
    New-Item -ItemType Directory -Path $BuildDir | Out-Null
}
Write-Success "  ✓ Build directory ready: $BuildDir"

# Configure CMake
Write-Info "`n[3/5] Configuring CMake..."
Push-Location $BuildDir

$CMakeArgs = @(
    "-DUSE_QT5=$(if ($EnableQt) { 'ON' } else { 'OFF' })"
    "../cpp_src"
)

Write-Info "  Command: cmake $CMakeArgs"

try {
    $Output = & cmake @CMakeArgs 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  ✓ CMake configuration successful"
    } else {
        Write-Error-Custom "  ✗ CMake configuration failed"
        Write-Host $Output
        Pop-Location
        exit 1
    }
} catch {
    Write-Error-Custom "  ✗ CMake configuration error: $_"
    Write-Warning-Custom "    NOTE: Ensure Visual Studio or C++ build tools are installed"
    Write-Warning-Custom "    Run from Developer Command Prompt for best results"
    Pop-Location
    exit 1
}

# Build the project
Write-Info "`n[4/5] Building project (Configuration: $Configuration)..."

try {
    Write-Info "  Running: cmake --build . --config $Configuration --verbose"
    $BuildOutput = & cmake --build . --config $Configuration --verbose 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  ✓ Build completed successfully"
        $Script:BuildSuccessful = $true
    } else {
        Write-Error-Custom "  ✗ Build failed"
        Write-Host $BuildOutput
        Pop-Location
        exit 1
    }
} catch {
    Write-Error-Custom "  ✗ Build error: $_"
    Pop-Location
    exit 1
}

# Find output executable
Write-Info "`n[5/5] Verifying build output..."
$ExePath = Join-Path $BuildDir $Configuration "LunaLite.exe"

if (Test-Path $ExePath) {
    Write-Success "  ✓ Executable created: $ExePath"
    $ExeSize = (Get-Item $ExePath).Length / 1MB
    Write-Success "    Size: $([Math]::Round($ExeSize, 2)) MB"
} else {
    Write-Warning-Custom "  ⚠ Executable not found at $ExePath"
}

# Check for library
$LibPath = Join-Path $BuildDir "$Configuration" "LunaLite_Engine.lib"
if (Test-Path $LibPath) {
    Write-Success "  ✓ Library created: $LibPath"
    $LibSize = (Get-Item $LibPath).Length / 1MB
    Write-Success "    Size: $([Math]::Round($LibSize, 2)) MB"
}

Pop-Location

# Open solution if requested
if ($OpenSolution) {
    Write-Info "`n[+] Opening Visual Studio solution..."
    $SlnPath = Join-Path $BuildDir "LunaLite.sln"
    
    if (Test-Path $SlnPath) {
        & devenv $SlnPath
        Write-Success "  ✓ Solution opened in Visual Studio"
    } else {
        Write-Warning-Custom "  ⚠ Solution file not found: $SlnPath"
    }
}

# Display summary
Write-Info @"
╔════════════════════════════════════════════════════════╗
║              Build Summary                             ║
╚════════════════════════════════════════════════════════╝

Configuration:   $Configuration
Qt Support:      $(if ($EnableQt) { 'Enabled' } else { 'Disabled' })
Build Directory: $BuildDir
"@

if ($Script:BuildSuccessful) {
    Write-Success "Status:          ✓ SUCCESS"
    Write-Info @"
Next Steps:
  1. Run executable: .\$Configuration\LunaLite.exe
  2. Link library: LunaLite_Engine.lib in include/$BuildDir
  3. Edit source: Modify files in cpp_src/

Documentation:
  - BUILD_INSTRUCTIONS.md    - Detailed build guide
  - INTEGRATION_GUIDE.md      - System integration
  - PROJECT_STATUS.md         - Project overview
"@
} else {
    Write-Error-Custom "Status:          ✗ FAILED"
    Write-Error-Custom "See output above for error details"
    exit 1
}

Write-Host ""
