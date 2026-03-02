#ifndef GAME_ACTOR_H
#define GAME_ACTOR_H

#include "Game_BattlerBase.h"
#include "qstring.h"
#include "qstring.h"

class Game_Actor : public Game_BattlerBase {
public:
    Game_Actor(int actorId);
    ~Game_Actor();

    void setup(int actorId);
    QString name() const;
    QString nickname() const;
    int profile() const;
    int actorId() const;
    bool isBattleMember() const;
    bool isFormationChangeOk() const;
    int faceIndex() const;
    QString charIndex() const;
    QString battlerName() const;
    int exp() const;
    void changeExp(int exp, bool display = false);
    int nextRequiredExp() const;
    int nextLevelExp() const;
    int currentLevelExp() const;
    void levelUp();
    void levelDown();
    void initEquips(const QList<int> &equips);
    void changeEquip(int slotId, int weaponId);
    void forceChangeEquip(int slotId, int armorId);
    void changeEquipById(int equipId, int slotId);
    bool isEquipped(int itemId) const;
    void discardEquip(int itemId);
    bool canEquip(int itemId) const;
    int weaponTypes() const;
    int armorTypes() const;
    bool isSkillLearned(int skillId) const;
    void learnSkill(int skillId);
    void forgetSkill(int skillId);
    bool hasStrongRecoverySkill() const;
    int skillPoints() const;
    void setSkillPoints(int sp);
    bool isStrongWeapon(int weaponId) const;
    bool isHigherLevel(int level) const;
    int param(int paramId) const;
    void addParam(int paramId, int value);
    void setParam(int paramId, int value);
    QList<int> equips() const;
    int weapon(int index = 0) const;
    int armor(int index) const;
    bool hasArmor(int armorId) const;
    int atk() const;
    int def() const;
    int mat() const;
    int mdf() const;
    int agi() const;
    int luk() const;
    void initTp();
    void maxTp() const;
    void resetTp();
    int tpRate() const;
    int hide() const;
    void setHide(int isHide);
    int performActionStart();
    int performAttack() const;
    int performGuard() const;
    int performLossyAction() const;
    QString makeAutoBattleActions();
    QString name2() const;
    int makeCommandList() const;
    int getMultipleHits() const;

private:
    int _actorId;
    QString _name;
    QString _nickname;
    int _level;
    int _exp;
    QList<int> _equips;
    QList<int> _skills;
    QMap<int, int> _params;
    int _hp;
    int _mp;
    int _tp;
};

#endif // GAME_ACTOR_H
