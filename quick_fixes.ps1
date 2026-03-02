# LunaLite Quick Fixes Script
# Fixes the most common compilation errors

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LunaLite Engine - Quick Fixes" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$fixCount = 0

# Fix 1: Add QFile methods to qstring.h
Write-Host "[1/5] Adding QFile methods..." -ForegroundColor Yellow
$qstringPath = "cpp_src/qstring.h"
$qstringContent = Get-Content $qstringPath -Raw

if ($qstringContent -notmatch "bool exists") {
    $insertion = @"

    // File operations
    bool exists(const QString& filename) {
        std::ifstream file(filename.c_str());
        return file.good();
    }
    
    bool remove(const QString& filename) {
        return std::remove(filename.c_str()) == 0;
    }
"@
    
    # Insert before the closing brace of QFile class
    $qstringContent = $qstringContent -replace "(class QFile.*?\{[^}]+)", "`$1$insertion"
    Set-Content -Path $qstringPath -Value $qstringContent
    Write-Host "  ✓ QFile methods added" -ForegroundColor Green
    $fixCount++
} else {
    Write-Host "  - QFile methods already exist" -ForegroundColor Gray
}

# Fix 2: Add QVector::mid() to qvector.h
Write-Host "`n[2/5] Adding QVector::mid()..." -ForegroundColor Yellow
$qvectorPath = "cpp_src/qvector.h"
if (Test-Path $qvectorPath) {
    $qvectorContent = Get-Content $qvectorPath -Raw
    
    if ($qvectorContent -notmatch "QVector mid") {
        $insertion = @"

    QVector<T> mid(int pos, int length = -1) const {
        if (pos < 0) pos = 0;
        if (pos >= this->size()) return QVector<T>();
        
        int len = (length < 0) ? (this->size() - pos) : length;
        if (pos + len > this->size()) len = this->size() - pos;
        
        QVector<T> result;
        for (int i = 0; i < len; i++) {
            result.push_back((*this)[pos + i]);
        }
        return result;
    }
"@
        
        $qvectorContent = $qvectorContent -replace "(public:[^}]+)", "`$1$insertion"
        Set-Content -Path $qvectorPath -Value $qvectorContent
        Write-Host "  ✓ QVector::mid() added" -ForegroundColor Green
        $fixCount++
    } else {
        Write-Host "  - QVector::mid() already exists" -ForegroundColor Gray
    }
}

# Fix 3: Add QMap iterators to qmap.h
Write-Host "`n[3/5] Adding QMap iterators..." -ForegroundColor Yellow
$qmapPath = "cpp_src/qmap.h"
if (Test-Path $qmapPath) {
    $qmapContent = Get-Content $qmapPath -Raw
    
    if ($qmapContent -notmatch "constBegin") {
        $insertion = @"

    typename std::map<K,V>::const_iterator constBegin() const {
        return this->begin();
    }
    
    typename std::map<K,V>::const_iterator constEnd() const {
        return this->end();
    }
"@
        
        $qmapContent = $qmapContent -replace "(public:[^}]+)", "`$1$insertion"
        Set-Content -Path $qmapPath -Value $qmapContent
        Write-Host "  ✓ QMap iterators added" -ForegroundColor Green
        $fixCount++
    } else {
        Write-Host "  - QMap iterators already exist" -ForegroundColor Gray
    }
}

# Fix 4: Fix Scene_BattleStart include path
Write-Host "`n[4/5] Fixing Scene_BattleStart include..." -ForegroundColor Yellow
$battleStartPath = "cpp_src/Scene_BattleStart.h"
if (Test-Path $battleStartPath) {
    $content = Get-Content $battleStartPath -Raw
    $content = $content -replace '#include "Scene_Base\.h\\"', '#include "Scene_Base.h"'
    Set-Content -Path $battleStartPath -Value $content
    Write-Host "  ✓ Include path fixed" -ForegroundColor Green
    $fixCount++
}

# Fix 5: Update Game_Screen_Ex.h return types
Write-Host "`n[5/5] Fixing Game_Screen_Ex return types..." -ForegroundColor Yellow
$screenPath = "cpp_src/Game_Screen_Ex.h"
if (Test-Path $screenPath) {
    $content = Get-Content $screenPath -Raw
    $content = $content -replace "void brightness\(\) const;", "int brightness() const;"
    $content = $content -replace "void weatherPower\(\) const;", "int weatherPower() const;"
    $content = $content -replace "void weather\(\) const;", "const char* weather() const;"
    Set-Content -Path $screenPath -Value $content
    Write-Host "  ✓ Return types fixed" -ForegroundColor Green
    $fixCount++
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Fixes Applied: $fixCount" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next step: Run build_direct.bat to recompile" -ForegroundColor Yellow
Write-Host "Expected improvement: 5-10 additional files compiled`n" -ForegroundColor Cyan
