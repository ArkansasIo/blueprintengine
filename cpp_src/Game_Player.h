#ifndef GAME_PLAYER_H
#define GAME_PLAYER_H

#include "qstring.h"

class Game_Player {
public:
    Game_Player();
    ~Game_Player();

    void initialize();
    void refresh();
    void reserveTransfer(int mapId, int x, int y, int d = 2);
    void requestMapReload();
    void setDirection(int d);
    int direction() const;
    bool isStopping() const;
    int x() const;
    int y() const;
    bool perform_transfer();
    bool is_transfer_requesting() const;
    void check_event_trigger_there(int triggers);
    void check_event_trigger_touch(int x, int y);
    void update();
    void updateDashing();
    void updateNonmoving(bool wasMoving);
    bool canMove() const;
    bool isAboutToDash() const;
    bool isDashing() const;
    bool isDebugThrough() const;
    void straighten();
    bool isMoving() const;
    bool isMovementSucceeded(int x = -1, int y = -1) const;
    bool canPassDiagonally(int horz, int vert) const;
    int getInputDirection() const;
    void executeMove(int direction);
    void updateScroll(int lastScrolledX, int lastScrolledY);
    void makeEncounter();
    bool triggerAction();
    bool triggerTouchAction();
    QString triggerTouchActionD3(int x1, int y1);
    QString triggerTouchActionD4(int x1, int y1, int x2, int y2);
    QString triggerTouchActionD5(int x1, int y1);
    QString startMapEvent(int x, int y, const QString &triggers);
    bool isInVehicle() const;
    bool isInBoat() const;
    bool isInShip() const;
    bool isInAirship() const;
    bool isIncapacitated() const;

private:
    int _x;
    int _y;
    int _direction;
    bool _moving;
    bool _dashing;
    int _vehicleType;
};

#endif // GAME_PLAYER_H
