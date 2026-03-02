#ifndef BATTLE_SYSTEM_H
#define BATTLE_SYSTEM_H

#include "GameActorFull.h"
#include "../utils/Types.h"
#include "qvector.h"

namespace LunaLite {
namespace Core {

struct BattleAction {
    enum Type {
        Attack,
        Skill,
        Item,
        Defend,
        Escape,
        None
    };
    
    Type type;
    int targetIndex;
    int skillId;
    int itemId;
    
    BattleAction() : type(None), targetIndex(0), skillId(0), itemId(0) {}
};

struct BattleResult {
    int damage;
    int heal;
    bool critical;
    bool hit;
    bool missed;
    QVector<StateId> statesApplied;
    
    BattleResult() : damage(0), heal(0), critical(false), hit(true), missed(false) {}
};

class BattleSystem {
public:
    static BattleSystem& instance();
    
    // Battle start/end
    void startBattle(const QVector<GameActorFull*> &allies,
                     const QVector<GameActorFull*> &enemies);
    void endBattle();
    bool isBattleActive() const;
    
    // Turn management
    void nextTurn();
    int getTurnCount() const;
    
    // Action queue
    void queueAction(GameActorFull* actor, const BattleAction &action);
    void executeNextAction();
    bool hasActionsQueued() const;
    
    // Battle queries
    QVector<GameActorFull*> getAllies() const;
    QVector<GameActorFull*> getEnemies() const;
    GameActorFull* getCurrentActor() const;
    
    // Result
    BattleResult getLastResult() const;
    
    // Battle state
    bool isVictory() const;
    bool isDefeat() const;
    
private:
    BattleSystem();
    ~BattleSystem();
    
    struct ActionEntry {
        GameActorFull* actor;
        BattleAction action;
    };
    
    QVector<GameActorFull*> _allies;
    QVector<GameActorFull*> _enemies;
    QVector<ActionEntry> _actionQueue;
    
    bool _active;
    int _turnCount;
    int _currentActionIndex;
    BattleResult _lastResult;
};

} // namespace Core
} // namespace LunaLite

#endif // BATTLE_SYSTEM_H
