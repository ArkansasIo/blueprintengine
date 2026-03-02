#ifndef EFFECTMANAGER_H
#define EFFECTMANAGER_H

#include "qstring.h"

class EffectManager {
public:
    static EffectManager& instance();
    
    void initialize();
    void playBattleObjectAnimation(int objectId, int animationId);
    void playBattleSystemAnimation(int animationId, int targetId);
    void playScreenFlash(int p1, int p2, int p3, int duration);
    void playScreenShake(int power, int speed, int duration);
    
private:
    EffectManager();
    ~EffectManager();
};

#endif // EFFECTMANAGER_H
