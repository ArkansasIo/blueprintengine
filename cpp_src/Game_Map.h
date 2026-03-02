#ifndef GAME_MAP_H
#define GAME_MAP_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

class Game_Map {
public:
    Game_Map();
    ~Game_Map();

    void setup(int mapId);
    void setupEvents();
    int mapId() const;
    QString displayName() const;
    bool isNameDisplayAllowed() const;
    bool isDarkAreaLarge() const;
    bool defaultCollider() const;
    int encounterStep() const;
    QList<int> encounterList() const;
    int encounter() const;
    bool isAllowAvoidance() const;
    QString mapNote() const;
    int battleBack1Name() const;
    int battleBack2Name() const;
    bool needsRefresh() const;
    void refresh();
    void autoplay();
    bool isLoopHorizontal() const;
    bool isLoopVertical() const;
    bool isScrollDown() const;
    bool isScrollLeft() const;
    bool isScrollRight() const;
    bool isScrollUp() const;
    int screenTileX() const;
    int screenTileY() const;
    int adjustX(int x) const;
    int adjustY(int y) const;
    int roundX(int x) const;
    int roundY(int y) const;
    bool isValid(int x, int y) const;
    bool checkPassage(int x, int y, int bit) const;
    bool isPassable(int x, int y, int d) const;
    bool isBoatPassable(int x, int y) const;
    bool isShipPassable(int x, int y) const;
    bool isAirshipLandOk(int x, int y) const;
    bool checkLayeredTiles(int x, int y, int bit) const;
    bool isBush(int x, int y) const;
    bool isCounter(int x, int y) const;
    bool isDamageFloor(int x, int y) const;
    bool isTerrain(int x, int y, int terrainTag) const;
    bool isRegion(int x, int y, int regionId) const;
    int terrainTag(int x, int y) const;
    int regionId(int x, int y) const;
    bool eventsXy(int x, int y) const;
    int tileId(int x, int y, int z) const;
    bool isAnyEventStarting() const;

private:
    int _mapId;
    QString _displayName;
    QMap<int, QString> _events;
    bool _needsRefresh;
};

#endif // GAME_MAP_H
