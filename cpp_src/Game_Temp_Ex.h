#ifndef GAME_TEMP_H
#define GAME_TEMP_H

#include "qstring.h"
#include "qstring.h"

class Game_Temp {
public:
    Game_Temp();
    ~Game_Temp();

    bool isPlaytest() const;
    void setPlaytest(bool value);
    
    QString mapEditorInitialized() const;
    void setMapEditorInitialized(bool value);
    
    bool needsMapLoader() const;
    void setNeedsMapLoader(bool value);
    
    int newMapId() const;
    void setNewMapId(int mapId);
    
    bool isTransferring() const;
    void setTransferring(bool value);
    
    int transferMapId() const;
    void setTransferMapId(int mapId);
    
    int transferX() const;
    void setTransferX(int x);
    
    int transferY() const;
    void setTransferY(int y);
    
    int transferDirection() const;
    void setTransferDirection(int direction);
    
    bool isEncounterEffectEnabled() const;
    void setEncounterEffectEnabled(bool value);
    
    QString battleSe() const;
    void setBattleSe(const QString &name);
    
    QString commonEventId() const;
    void setCommonEventId(const QString &id);
    
private:
    bool _playtest;
    bool _mapEditorInitialized;
    bool _needsMapLoader;
    int _newMapId;
    bool _transferring;
    int _transferMapId;
    int _transferX;
    int _transferY;
    int _transferDirection;
};

#endif // GAME_TEMP_H
