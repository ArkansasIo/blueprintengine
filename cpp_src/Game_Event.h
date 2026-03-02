#ifndef GAME_EVENT_H
#define GAME_EVENT_H

#include "qstring.h"
#include "qstring.h"

class Game_Event {
public:
    Game_Event(int mapId, int eventId);
    ~Game_Event();

    void initialize(int mapId, int eventId);
    void refresh();
    void setupPageSettings();
    void clearPageSettings();
    void setupMoveRoute(const QString &route);
    int eventId() const;
    QString event() const;
    int x() const;
    int y() const;
    void setPosition(int x, int y);
    int direction() const;
    void setDirection(int direction);
    bool isJumping() const;
    void jump(int deltaX, int deltaY);
    bool isMoveRouteForcing() const;
    void forceMoveRoute(const QString &route);
    void cancelMoveRoute();
    bool isStarting() const;
    bool isErased() const;
    void start();
    void erase();
    bool isTriggerIn(const QList<int> &triggers) const;
    void update();
    void updateSelfMovement();
    void updateStop();
    bool checkEventTriggerTouch(int x, int y);
    
private:
    int _mapId;
    int _eventId;
    int _x;
    int _y;
    int _direction;
    bool _starting;
    bool _erased;
};

#endif // GAME_EVENT_H
