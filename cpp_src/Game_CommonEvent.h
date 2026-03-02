#ifndef GAME_COMMONVENT_H
#define GAME_COMMONVENT_H

#include "qstring.h"

class Game_CommonEvent {
public:
    Game_CommonEvent(int id);
    ~Game_CommonEvent();

    int eventId() const;
    QString name() const;
    void setName(const QString &name);
    
    void update();
    void start();
    void stop();
    bool isActive() const;
    
    bool isTrigger(int trigger) const;
    void setTrigger(int trigger);
    
private:
    int _eventId;
    QString _name;
    bool _active;
    int _trigger;
};

#endif // GAME_COMMONVENT_H
