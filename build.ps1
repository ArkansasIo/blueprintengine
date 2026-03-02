param(
    [ValidateSet('Debug', 'Release')]
    [string]$Configuration = 'Release',
    
    [switch]$EnableQt = $false,
    [switch]$CleanBuild = $false,
    [switch]$OpenSolution = $false,
    [switch]$Help = $false
)

# Colors
$ColorOK = "Green"
$ColorErr = "Red"
$ColorWarn = "Yellow"
$ColorInfo = "Cyan"

Write-Host ""
Write-Host "====================================================" -ForegroundColor $ColorInfo
Write-Host "  LunaLite Game Engine - Build System v1.0" -ForegroundColor $ColorInfo
Write-Host "====================================================" -ForegroundColor $ColorInfo
Write-Host ""

if ($Help) {
    Write-Host "Usage: .\build.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Configuration <Debug|Release>  Build configuration (default: Release)"
    Write-Host "  -EnableQt                       Enable Qt5 support"
    Write-Host "  -CleanBuild                     Remove previous build artifacts"
    Write-Host "  -OpenSolution                   Open solution in Visual Studio"
    Write-Host "  -Help                           Show this help message"
    Write-Host ""
    exit 0
}

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceDir = Join-Path $ProjectRoot "cpp_src"
$BuildDir = Join-Path $ProjectRoot "build"

# Check prerequisites
Write-Host "[1/4] Checking prerequisites..." -ForegroundColor $ColorInfo

$cmake = Get-Command cmake -ErrorAction SilentlyContinue
if (-not $cmake) {
    Write-Host "ERROR: CMake not found" -ForegroundColor $ColorErr
    exit 1
}
Write-Host "  OK: CMake found" -ForegroundColor $ColorOK

if (-not (Test-Path $SourceDir)) {
    Write-Host "ERROR: Source directory not found: $SourceDir" -ForegroundColor $ColorErr
    exit 1
}
Write-Host "  OK: Source directory found" -ForegroundColor $ColorOK

if (-not (Test-Path "$SourceDir/CMakeLists.txt")) {
    Write-Host "ERROR: CMakeLists.txt not found" -ForegroundColor $ColorErr
    exit 1
}
Write-Host "  OK: CMakeLists.txt found" -ForegroundColor $ColorOK

# Clean if requested
if ($CleanBuild) {
    Write-Host "[2/4] Cleaning previous build..." -ForegroundColor $ColorInfo
    if (Test-Path $BuildDir) {
        Remove-Item -Recurse -Force $BuildDir -ErrorAction SilentlyContinue
        Write-Host "  OK: Build directory cleaned" -ForegroundColor $ColorOK
    }
}

# Create build directory
Write-Host "[2/4] Setting up build directory..." -ForegroundColor $ColorInfo
if (-not (Test-Path $BuildDir)) {
    New-Item -ItemType Directory -Path $BuildDir | Out-Null
}
Write-Host "  OK: Build directory ready" -ForegroundColor $ColorOK

# Configure with CMake
Write-Host "[3/4] Configuring CMake..." -ForegroundColor $ColorInfo
Push-Location $BuildDir

$QtFlagValue = if ($EnableQt) { "ON" } else { "OFF" }
Write-Host "  Qt Flag: $QtFlagValue" -ForegroundColor $ColorInfo
$Output = & cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release "-DENABLE_QT=$QtFlagValue" "..\cpp_src" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: CMake configuration failed" -ForegroundColor $ColorErr
    Write-Host $Output
    Pop-Location
    exit 1
}
Write-Host "  OK: CMake configuration complete" -ForegroundColor $ColorOK

# Build
Write-Host "[4/4] Building project..." -ForegroundColor $ColorInfo

$BuildOutput = & cmake --build . --config $Configuration 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor $ColorErr
    Write-Host $BuildOutput
    Pop-Location
    exit 1
}
Write-Host "  OK: Build complete" -ForegroundColor $ColorOK

Pop-Location

# Summary
Write-Host ""
Write-Host "====================================================" -ForegroundColor $ColorInfo
Write-Host "  Build Summary" -ForegroundColor $ColorInfo
Write-Host "====================================================" -ForegroundColor $ColorInfo
Write-Host ""
Write-Host "Configuration:  $Configuration"
Write-Host "Qt Support:     $(if ($EnableQt) { 'Enabled' } else { 'Disabled' })"
Write-Host "Build Dir:      $BuildDir"
Write-Host ""
Write-Host "SUCCESS - Build completed!" -ForegroundColor $ColorOK
Write-Host ""
Write-Host "Output Files:"
Write-Host "  - Executable: build\$Configuration\LunaLite.exe"
Write-Host "  - Library:    build\$Configuration\LunaLite_Engine.lib"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "  1. Run: .\build\$Configuration\LunaLite.exe"
Write-Host "  2. Link: build\$Configuration\LunaLite_Engine.lib"
Write-Host "  3. Edit: cpp_src\ (modify source files)"
Write-Host ""
