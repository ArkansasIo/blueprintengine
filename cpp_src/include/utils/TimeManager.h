#ifndef TIME_MANAGER_H
#define TIME_MANAGER_H

#include <chrono>
#include "qstring.h"
#include "qobject.h"

class TimeManager : public QObject {
    Q_OBJECT

public:
    static TimeManager& instance();
    
    void initialize(int targetFps = 60);
    void update();
    
    // Delta time
    double getDeltaTime() const;
    float getDeltaTimeFloat() const;
    
    // Frame timing
    int getFrameCount() const;
    int getFps() const;
    float getFrameTime() const;
    
    // Pause/Resume
    void pause();
    void resume();
    bool isPaused() const;
    
    // Time scaling
    void setTimeScale(float scale);
    float getTimeScale() const;
    
private:
    TimeManager();
    ~TimeManager();
    
    std::chrono::high_resolution_clock::time_point _lastFrameTime;
    double _deltaTime;
    int _frameCount;
    int _fps;
    float _frameTime;
    bool _paused;
    float _timeScale;
    int _targetFps;
};

#endif // TIME_MANAGER_H
