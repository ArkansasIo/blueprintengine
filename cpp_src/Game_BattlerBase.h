#ifndef GAME_BATTLERBASE_H
#define GAME_BATTLERBASE_H

#include "qstring.h"
#include "qstring.h"

class Game_BattlerBase {
public:
    Game_BattlerBase();
    virtual ~Game_BattlerBase();

    virtual void initialize();
    int level() const;
    int exp() const;
    int maxHp() const;
    int maxMp() const;
    int hp() const;
    void setHp(int value);
    int mp() const;
    void setMp(int value);
    int tp() const;
    void setTp(int value);
    int mhp() const;
    int mmp() const;
    bool isAlive() const;
    bool isDead() const;
    bool isActor() const;
    bool isEnemy() const;
    void refresh();
    void addState(int stateId);
    void removeState(int stateId);
    bool isStateAffected(int stateId) const;
    bool isStateClear() const;
    QList<int> states() const;
    int stateTurns(int stateId) const;
    void minTurnsStateEffectRemoving(int stateId);
    void resetStateCounts();
    QString mostImportantStateText() const;
    QString iconIndex() const;
    bool canInput() const;
    bool canMove() const;
    int speed() const;
    int param(int paramId) const;
    int xparam(int xparamId) const;
    int sparam(int sparamId) const;
    bool isSkillTypeSealed(int skillTypeId) const;
    bool isEquipTypeSealed(int equipTypeId) const;
    bool isEquipLocked(int slotId) const;
    bool canEquip(int itemId) const;
    bool canUse(int itemId) const;
    int elementRate(int elementId) const;
    double debuffRate(int paramId) const;
    int stateRate(int stateId) const;
    int stateResistSet() const;
    int isStateResist(int stateId) const;
    bool isSkillWtypeOk(int skillId) const;
    bool isSkilledWeaponByType(int wtypeId) const;
    bool attackElements() const;
    bool guardElements() const;
    int debuffMax() const;
    int stateGroups() const;
    bool isGroupDefeat() const;
    int faceName() const;
    int faceIndex() const;
    int charIndex() const;
    QString characterName() const;
    bool isSpriteVisible() const;
    QString battlerName() const;
    bool isConfused() const;
    void performActionStart();
    void performAction();
    void performActionEnd();
    void performDamage();
    void performMiss();
    void performRecovery();
    void performEvasion();
    void performMagicEvasion();
    void performCounter();
    void performReflection();
    void performSubstitute();
    
protected:
    int _hp;
    int _mp;
    int _tp;
    int _level;
    QList<int> _states;
    QList<int> _stateTurns;
    int _hidden;
};

#endif // GAME_BATTLERBASE_H
