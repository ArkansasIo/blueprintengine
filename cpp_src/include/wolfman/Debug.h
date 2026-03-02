#ifndef WOLFMAN_DEBUG_H
#define WOLFMAN_DEBUG_H

#include "qstring.h"
#include "qvector.h"
#include <functional>

namespace WolfManAlpha {

enum class LogLevel {
    Debug,
    Info,
    Warning,
    Error,
    Critical
};

class Logger {
public:
    static Logger& instance();
    
    // Logging
    void log(LogLevel level, const QString &message);
    void debug(const QString &message);
    void info(const QString &message);
    void warning(const QString &message);
    void error(const QString &message);
    void critical(const QString &message);
    
    // Callbacks
    void onLog(std::function<void(LogLevel, const QString&)> callback);
    
    // Output
    void setOutputFile(const QString &filePath);
    void setConsoleOutput(bool enabled);
    
    // History
    QVector<QString> getLogHistory(int maxLines = 100) const;
    void clearHistory();
    
private:
    Logger();
    ~Logger();
    
    QVector<QString> _history;
    QString _outputFile;
    bool _consoleOutput;
};

// Debug overlay
class DebugOverlay {
public:
    static DebugOverlay& instance();
    
    bool isEnabled() const;
    void setEnabled(bool enabled);
    
    // Display options
    void showFps(bool show);
    void showMemory(bool show);
    void showEntityCount(bool show);
    void showDebugInfo(bool show);
    
    // Debug drawing
    void drawLine(float x1, float y1, float x2, float y2, int color = 0xFF00FF00);
    void drawCircle(float x, float y, float radius, int color = 0xFF00FF00);
    void drawText(float x, float y, const QString &text, int color = 0xFF00FF00);
    
    void update();
    void render();
    
private:
    DebugOverlay();
    ~DebugOverlay();
    
    bool _enabled;
    bool _showFps;
    bool _showMemory;
    bool _showEntityCount;
    bool _showDebugInfo;
};

// Profiler
class Profiler {
public:
    static Profiler& instance();
    
    // Start/Stop profiling
    void beginProfile(const QString &label);
    void endProfile(const QString &label);
    
    // Statistics
    float getProfileTime(const QString &label) const;
    QVector<QString> getProfileSummary() const;
    
    void reset();
    void setEnabled(bool enabled);
    
private:
    Profiler();
    ~Profiler();
    
    QMap<QString, float> _profiles;
    bool _enabled;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_DEBUG_H
