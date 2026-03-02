#ifndef GAME_MAP_H
#define GAME_MAP_H

#include "../utils/Types.h"
#include "qstring.h"
#include "qvector.h"
#include "qstring.h"

namespace LunaLite {
namespace Core {

class GameMap : public GameObject {
public:
    GameMap(int mapId);
    ~GameMap();
    
    // Map info
    int getMapId() const;
    QString getMapName() const;
    int getWidth() const;
    int getHeight() const;
    
    // Tileset
    int getTilesetId() const;
    
    // Battleback
    QString getBattleback1Name() const;
    QString getBattleback2Name() const;
    
    // Properties
    bool isAllowDashing() const;
    bool isEncounterEnabled() const;
    int getEncounterRate() const;
    
    // Events
    int getEventCount() const;
    bool hasEvent(int eventId) const;
    
    // Data access
    bool setTile(int x, int y, int layer, int tileId);
    int getTile(int x, int y, int layer) const;
    
    // Parallax
    bool hasParallax() const;
    QString getParallaxName() const;
    bool isParallaxLooping() const;
    
    void initialize() override;
    void update() override;
    
private:
    int _mapId;
    QString _mapName;
    int _width;
    int _height;
    int _tilesetId;
    QString _battleback1;
    QString _battleback2;
    bool _allowDashing;
    bool _encounterEnabled;
    int _encounterRate;
    
    QString _parallaxName;
    bool _parallaxLooping;
    
    QMap<QString, int> _mapData;  // "x,y,layer" -> tileId
    QVector<int> _events;
};

} // namespace Core
} // namespace LunaLite

#endif // GAME_MAP_H
