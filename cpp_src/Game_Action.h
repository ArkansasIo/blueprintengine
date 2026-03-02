#ifndef GAME_ACTION_H
#define GAME_ACTION_H

#include "qstring.h"
#include "qstring.h"

class Game_Action {
public:
    Game_Action(int subjectIndex = 0);
    ~Game_Action();

    void clear();
    void setSubject(int subjectIndex);
    int subject() const;
    int friendsUnit() const;
    int opponentsUnit() const;
    bool isValid() const;
    bool isForOpponent() const;
    bool isForFriend() const;
    bool isForDeadFriend() const;
    bool isForUser() const;
    bool isForOne() const;
    bool isForRandom() const;
    bool isForAll() const;
    int numTargets() const;
    void setItemObject(const QString &item);
    QString itemObject() const;
    int speed() const;
    int makeTargets() const;
    bool testApply(int targetIndex) const;
    bool testLifeAndDeath(int targetIndex) const;
    void apply(int targetIndex);
    bool testSkillEffect(int targetIndex) const;
    bool testItemEffect(int targetIndex) const;
    void itemEffectApply(int targetIndex);
    void itemEffectRecovery(int targetIndex);
    void itemEffectCommonDamage(int targetIndex);
    void itemEffectCommonRecovery(int targetIndex);
    void itemEffectRemoving(int targetIndex);
    void itemEffectRecoveringHP(int targetIndex);
    void itemEffectRecoveringMP(int targetIndex);
    void itemEffectGainTP(int targetIndex);
    void itemEffectAddingState(int targetIndex);
    void itemEffectRemovingState(int targetIndex);
    void itemEffectAddingBuff(int targetIndex);
    void itemEffectAddingDebuff(int targetIndex);
    void itemEffectRemovingBuff(int targetIndex);
    void itemEffectRemovingDebuff(int targetIndex);
    void itemEffectSpecial(int targetIndex);
    void itemEffectGrowth(int targetIndex);
    void itemEffectLearnSkill(int targetIndex);
    
private:
    int _subjectActorIndex;
    QString _itemObject;
    QList<int> _targets;
    QString _item;
    bool _isPlugin;
    
    bool testActionEffect() const;
    bool testItemStateEffect() const;
};

#endif // GAME_ACTION_H
