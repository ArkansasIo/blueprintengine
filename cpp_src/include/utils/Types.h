#ifndef LUNALITE_TYPES_H
#define LUNALITE_TYPES_H

#include "qstring.h"
#include "qvector.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

namespace LunaLite {

// Basic type definitions
using ActorId = int;
using ItemId = int;
using SkillId = int;
using WeaponId = int;
using ArmorId = int;
using EnemyId = int;
using MapId = int;
using EventId = int;
using SwitchId = int;
using VariableId = int;
using TroopId = int;
using StateId = int;

// RPG Element structures
struct Parameter {
    int hp;
    int mp;
    int atk;
    int def;
    int mat;
    int mdf;
    int agi;
    int luk;
    
    Parameter() : hp(0), mp(0), atk(0), def(0), mat(0), mdf(0), agi(0), luk(0) {}
};

struct Equipment {
    WeaponId weaponId;
    QVector<ArmorId> armors;
    
    Equipment() : weaponId(0) {}
};

struct Damage {
    int value;
    bool isHit;
    bool isCritical;
    
    Damage() : value(0), isHit(false), isCritical(false) {}
};

struct Effect {
    int code;
    int dataId;
    double value1;
    double value2;
    
    Effect() : code(0), dataId(0), value1(0), value2(0) {}
};

struct SkillResult {
    int damage;
    bool hit;
    bool critical;
    int heal;
    QVector<StateId> addedStates;
    QVector<StateId> removedStates;
    
    SkillResult() : damage(0), hit(false), critical(false), heal(0) {}
};

// Game configuration
struct GameConfig {
    QString gameName;
    int screenWidth;
    int screenHeight;
    bool debugMode;
    
    GameConfig() : screenWidth(816), screenHeight(624), debugMode(false) {}
};

} // namespace LunaLite

#endif // LUNALITE_TYPES_H
