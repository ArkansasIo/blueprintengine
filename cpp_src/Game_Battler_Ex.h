#ifndef GAME_BATTLER_H
#define GAME_BATTLER_H

#include "Game_BattlerBase.h"

class Game_Battler : public Game_BattlerBase {
public:
    Game_Battler();
    ~Game_Battler();

    void initialize() override;
    void update();
    
    void regenerateHp();
    void regenerateMp();
    void regenerateTp();
    void updateBuffs();
    void removeBuffAuto();
    
    void addNewState(int stateId);
    void onRestrict();
    void onAllActionsEnd();
    
private:
};

#endif // GAME_BATTLER_H
