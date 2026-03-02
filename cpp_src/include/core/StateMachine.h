#ifndef STATE_MACHINE_H
#define STATE_MACHINE_H

#include "qstring.h"
#include "qstring.h"

namespace LunaLite {
namespace Core {

class StateMachine {
public:
    enum class GameState {
        BOOT,
        TITLE,
        MENU,
        MAP,
        BATTLE,
        PAUSE,
        SHUTDOWN
    };
    
    StateMachine();
    ~StateMachine();
    
    void setState(GameState newState);
    GameState getState() const;
    GameState getPreviousState() const;
    
    bool isTransitioning() const;
    void updateTransition();
    
    QString getStateName() const;
    
private:
    GameState _currentState;
    GameState _previousState;
    GameState _nextState;
    bool _transitioning;
    int _transitionTimer;
};

} // namespace Core
} // namespace LunaLite

#endif // STATE_MACHINE_H
