#ifndef GAME_VEHICLE_H
#define GAME_VEHICLE_H

#include "qstring.h"

class Game_Vehicle {
public:
    Game_Vehicle(int type);
    ~Game_Vehicle();

    void initialize(const QString &mapName, int x, int y);
    void update();
    
    int vehicleType() const;
    void setLocation(int mapId, int x, int y);
    
    void getOn();
    void getOff();
    bool isInside() const;
    
    bool isMoving() const;
    bool isValid() const;

private:
    int _vehicleType;  // 0: boat, 1: ship, 2: airship
    int _mapId;
    int _x, _y;
};

#endif // GAME_VEHICLE_H
