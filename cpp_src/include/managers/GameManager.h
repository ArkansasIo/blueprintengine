#ifndef GAME_MANAGER_H
#define GAME_MANAGER_H

#include "qstring.h"
#include "../core/StateMachine.h"

namespace LunaLite {
namespace Managers {

class GameManager {
public:
    static GameManager& instance();
    
    // Game lifecycle
    bool initialize(int width, int height, const QString &gameName);
    void update();
    void render();
    void shutdown();
    
    // Game state
    Core::StateMachine::GameState getGameState() const;
    void setGameState(Core::StateMachine::GameState state);
    
    // Game info
    QString getGameName() const;
    int getGameWidth() const;
    int getGameHeight() const;
    
    bool isRunning() const;
    bool isPaused() const;
    
    void pause();
    void resume();
    
    // Frame info
    double getDeltaTime() const;
    int getFps() const;
    int getFrameCount() const;
    
    // Debug mode
    bool isDebugMode() const;
    void setDebugMode(bool enabled);
    
private:
    GameManager();
    ~GameManager();
    
    bool _initialized;
    bool _running;
    bool _paused;
    bool _debugMode;
    
    QString _gameName;
    int _width;
    int _height;
    
    int _frameCount;
};

} // namespace Managers
} // namespace LunaLite

#endif // GAME_MANAGER_H
