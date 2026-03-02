#ifndef WOLFMAN_ALPHA_CORE_H
#define WOLFMAN_ALPHA_CORE_H

#include "qstring.h"
#include "qvector.h"
#include <memory>

namespace WolfManAlpha {

// Version info
constexpr int VERSION_MAJOR = 1;
constexpr int VERSION_MINOR = 0;
constexpr int VERSION_PATCH = 0;
constexpr const char* VERSION_STRING = "WolfMan Alpha 1.0.0";

// Core engine class
class Engine {
public:
    static Engine& instance();
    
    // Initialization
    bool initialize(int width, int height, const QString &title);
    void shutdown();
    bool isInitialized() const;
    
    // Main loop
    void update(float deltaTime);
    void render();
    bool isRunning() const;
    void requestShutdown();
    
    // Engine info
    QString getEngineVersion() const;
    int getWidth() const;
    int getHeight() const;
    QString getTitle() const;
    
    // Performance
    float getFps() const;
    float getDeltaTime() const;
    int getFrameCount() const;
    
    // Debug mode
    bool isDebugMode() const;
    void setDebugMode(bool enabled);
    
    // Memory management
    long long getTotalMemoryUsage() const;
    void reportMemoryUsage() const;
    
private:
    Engine();
    ~Engine();
    
    bool _initialized;
    bool _running;
    bool _debugMode;
    
    int _width;
    int _height;
    QString _title;
    
    float _fps;
    float _deltaTime;
    int _frameCount;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_ALPHA_CORE_H
