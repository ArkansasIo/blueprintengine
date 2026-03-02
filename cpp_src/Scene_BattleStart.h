#ifndef SCENE_BATTLESTART_H
#define SCENE_BATTLESTART_H

#include "Scene_Base.h"

class Scene_BattleStart : public Scene_Base {
public:
    Scene_BattleStart();
    ~Scene_BattleStart();

    void initialize() override;
    void create() override;
    void start() override;
    void update() override;
    void stop() override;
    void terminate() override;

private:
    int _battlePhase;
};

#endif // SCENE_BATTLESTART_H
