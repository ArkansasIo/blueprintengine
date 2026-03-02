#ifndef GAME_FOLLOWERS_H
#define GAME_FOLLOWERS_H

#include "qvector.h"

class Game_Character;

class Game_Followers {
public:
    Game_Followers();
    ~Game_Followers();

    void initialize();
    void refresh();
    void update();
    
    void gatherAroundLeader();
    void awaitPartyFormation();
    bool isMoving() const;
    bool areGathered() const;
    
    Game_Character *follower(int index);
    int count() const;
    void updateMove();
    
private:
    QVector<Game_Character*> _followers;
};

#endif // GAME_FOLLOWERS_H
