#ifndef DATA_MANAGER_CORE_H
#define DATA_MANAGER_CORE_H

#include "qstring.h"
#include "qstring.h"
#include "qvector.h"
#include "../utils/Types.h"

namespace LunaLite {
namespace Managers {

// Forward declarations
class ActorData;
class ItemData;
class SkillData;
class WeaponData;
class ArmorData;
class EnemyData;

class DataManager {
public:
    static DataManager& instance();
    
    // Load all game data
    bool loadAllData(const QString &dataPath);
    
    // Individual data loading
    bool loadActorsData(const QString &filePath);
    bool loadItemsData(const QString &filePath);
    bool loadSkillsData(const QString &filePath);
    bool loadWeaponsData(const QString &filePath);
    bool loadArmorsData(const QString &filePath);
    bool loadEnemiesData(const QString &filePath);
    bool loadTroopsData(const QString &filePath);
    bool loadMapsData(const QString &filePath);
    bool loadStatesData(const QString &filePath);
    
    // Data queries
    int getMaxActorId() const;
    int getMaxItemId() const;
    int getMaxSkillId() const;
    int getMaxWeaponId() const;
    int getMaxArmorId() const;
    int getMaxEnemyId() const;
    
    // Check existence
    bool hasActor(int id) const;
    bool hasItem(int id) const;
    bool hasSkill(int id) const;
    bool hasWeapon(int id) const;
    bool hasArmor(int id) const;
    bool hasEnemy(int id) const;
    
    // Database state
    bool isLoaded() const;
    void clear();
    
    // Save/Load game
    bool saveGame(const QString &filePath);
    bool loadGame(const QString &filePath);
    
private:
    DataManager();
    ~DataManager();
    
    bool _loaded;
    int _maxActorId;
    int _maxItemId;
    int _maxSkillId;
    int _maxWeaponId;
    int _maxArmorId;
    int _maxEnemyId;
    
    QMap<int, ActorData*> _actors;
    QMap<int, ItemData*> _items;
    QMap<int, SkillData*> _skills;
    QMap<int, WeaponData*> _weapons;
    QMap<int, ArmorData*> _armors;
    QMap<int, EnemyData*> _enemies;
};

} // namespace Managers
} // namespace LunaLite

#endif // DATA_MANAGER_CORE_H
