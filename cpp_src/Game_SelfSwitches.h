#ifndef GAME_SELFSWITCHES_H
#define GAME_SELFSWITCHES_H

#include "qstring.h"
#include "qstring.h"

class Game_SelfSwitches {
public:
    Game_SelfSwitches();
    ~Game_SelfSwitches();

    void initialize();
    bool value(int mapId, int eventId, const QString &switchId) const;
    void setValue(int mapId, int eventId, const QString &switchId, bool value);
    void clear();
    void clearMap(int mapId);
    void onChange();
    
private:
    QMap<QString, bool> _data;
    
    QString makeKey(int mapId, int eventId, const QString &switchId) const;
};

#endif // GAME_SELFSWITCHES_H
