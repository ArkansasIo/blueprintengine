#ifndef GAME_ACTOR_FULL_H
#define GAME_ACTOR_FULL_H

#include "GameObject.h"
#include "../utils/Types.h"
#include "qvector.h"

namespace LunaLite {
namespace Core {

class GameActorFull : public GameObject {
public:
    GameActorFull(int actorId);
    ~GameActorFull();
    
    // Level and experience
    int getLevel() const;
    void setLevel(int level);
    int getExp() const;
    void addExp(int amount);
    int getNextLevelExp() const;
    
    // HP/MP/TP
    int getHp() const;
    void setHp(int hp);
    int getMaxHp() const;
    int getMp() const;
    void setMp(int mp);
    int getMaxMp() const;
    int getTp() const;
    void setTp(int tp);
    
    // Parameters
    Parameter getParameters() const;
    int getParam(int paramId) const;
    void addParameterBonus(int paramId, int value);
    
    // States
    bool isStateAffected(StateId stateId) const;
    void addState(StateId stateId);
    void removeState(StateId stateId);
    void clearStates();
    
    // Equipment
    void equip(WeaponId weaponId, const QVector<ArmorId> &armors);
    WeaponId getWeapon() const;
    QVector<ArmorId> getArmors() const;
    
    // Skills
    void learnSkill(SkillId skillId);
    void forgetSkill(SkillId skillId);
    bool hasSkill(SkillId skillId) const;
    QVector<SkillId> getSkills() const;
    
    // Status
    bool isAlive() const;
    bool isDead() const;
    bool isCancel() const;
    
    // Buffs
    int getBuff(int paramId) const;
    void addBuff(int paramId, int stages);
    void removeBuff(int paramId, int stages);
    void clearBuffs();
    
    void initialize() override;
    void update() override;
    
private:
    int _level;
    int _exp;
    int _hp, _maxHp;
    int _mp, _maxMp;
    int _tp;
    
    Parameter _baseParams;
    Parameter _paramBonuses;
    
    QVector<StateId> _states;
    
    WeaponId _weapon;
    QVector<ArmorId> _armors;
    
    QVector<SkillId> _skills;
    
    QMap<int, int> _buffs;  // paramId -> buff level
};

} // namespace Core
} // namespace LunaLite

#endif // GAME_ACTOR_FULL_H
