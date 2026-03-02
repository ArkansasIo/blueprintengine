#ifndef GAME_SKILL_H
#define GAME_SKILL_H

#include "qstring.h"

class Game_Skill {
public:
    Game_Skill(int skillId);
    ~Game_Skill();

    int skillId() const;
    QString name() const;
    QString description() const;
    
    int type1() const;
    int type2() const;
    int mpCost() const;
    int scope() const;
    
    bool isSkill() const;
    bool isDamage() const;
    bool isRecover() const;
    
private:
    int _skillId;
};

#endif // GAME_SKILL_H
