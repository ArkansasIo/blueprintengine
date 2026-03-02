#ifndef DATABASE_H
#define DATABASE_H

#include "qvector.h"
#include "qstring.h"
#include "qstring.h"
#include "../utils/Types.h"

namespace LunaLite {
namespace Data {

class Database {
public:
    static Database& instance();
    
    // Load game databases
    bool loadActors(const QString &filePath);
    bool loadItems(const QString &filePath);
    bool loadSkills(const QString &filePath);
    bool loadWeapons(const QString &filePath);
    bool loadArmors(const QString &filePath);
    bool loadEnemies(const QString &filePath);
    bool loadTroops(const QString &filePath);
    bool loadMaps(const QString &filePath);
    bool loadStates(const QString &filePath);
    
    // Get data
    class ActorData {
    public:
        int id;
        QString name;
        Parameter initialParams;
        Parameter maxParams;
        Equipment equips;
        QVector<int> learnedSkills;
    };
    
    ActorData* getActor(ActorId id);
    
    // Database queries
    int getActorCount() const;
    int getMaxActorId() const;
    bool hasActor(ActorId id) const;
    
private:
    Database();
    ~Database();
    
    QMap<ActorId, ActorData*> _actors;
    QMap<ItemId, void*> _items;
    QMap<SkillId, void*> _skills;
    QMap<WeaponId, void*> _weapons;
    QMap<ArmorId, void*> _armors;
    QMap<EnemyId, void*> _enemies;
    QMap<TroopId, void*> _troops;
    QMap<StateId, void*> _states;
};

} // namespace Data
} // namespace LunaLite

#endif // DATABASE_H
