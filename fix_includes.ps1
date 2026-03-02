param(
    [string]$RootDir = "d:\New folder (5)\LunaLite\cpp_src"
)

$patterns = @(
    @{old='#include <QString>'; new='#include "qstring.h"'},
    @{old='#include <Qvector>'; new='#include "qvector.h"'},
    @{old='#include <QVector>'; new='#include "qvector.h"'},
    @{old='#include <QMap>'; new='#include "qstring.h"'},
    @{old='#include <QList>'; new='#include "qstring.h"'},
    @{old='#include <QColor>'; new='#include "qcolor.h"'},
    @{old='#include <QRect>'; new='#include "qstring.h"'},
    @{old='#include <QSize>'; new='#include "qstring.h"'},
    @{old='#include <QPoint>'; new='#include "qstring.h"'},
    @{old='#include <QObject>'; new='#include "qobject.h"'},
    @{old='#include <QApplication>'; new='#include "qapplication.h"'},
    @{old='#include <QPushButton>'; new='#include "qstring.h"'},
    @{old='#include <QStringList>'; new='#include "qstring.h"'},
    @{old='#include <QWidget>'; new='#include "qstring.h"'},
    @{old='#include <QMainWindow>'; new='#include "qstring.h"'},
    @{old='#include <QListWidget>'; new='#include "qstring.h"'},
    @{old='#include <QTextEdit>'; new='#include "qstring.h"'},
    @{old='#include <QLineEdit>'; new='#include "qstring.h"'},
    @{old='#include <QSplitter>'; new='#include "qstring.h"'},
    @{old='#include <QStackedWidget>'; new='#include "qstring.h"'},
    @{old='#include <QLabel>'; new='#include "qstring.h"'},
    @{old='#include <QStatusBar>'; new='#include "qstring.h"'},
    @{old='#include <QVariant>'; new='#include "qstring.h"'},
    @{old='#include <QByteArray>'; new='#include "qstring.h"'},
    @{old='#include <QJsonObject>'; new='#include "qstring.h"'},
    @{old='#include <QJsonDocument>'; new='#include "qstring.h"'},
    @{old='#include <QJsonArray>'; new='#include "qstring.h"'},
    @{old='#include <QJsonValue>'; new='#include "qstring.h"'},
    @{old='#include <QSet>'; new='#include "qstring.h"'},
    @{old='#include <QTimer>'; new='#include "qstring.h"'},
    @{old='#include <QStack>'; new='#include "qstring.h"'},
    @{old='#include <QPixmap>'; new='#include "qstring.h"'}
)

$fileCount = 0
$replaceCount = 0

Get-ChildItem -Path $RootDir -Filter "*.h" -Recurse | ForEach-Object {
    $file = $_
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    foreach ($pattern in $patterns) {
        $content = $content -replace [regex]::Escape($pattern.old), $pattern.new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fileCount++
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "Fixed $fileCount header files"
