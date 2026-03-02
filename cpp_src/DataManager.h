#ifndef DATAMANAGER_H
#define DATAMANAGER_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

class DataManager {
public:
    static DataManager& instance();
    
    void initialize();
    void loadDatabase();
    void loadActors();
    void loadClasses();
    void loadSkills();
    void loadItems();
    void loadWeapons();
    void loadArmors();
    void loadEnemies();
    void loadTroops();
    void loadStates();
    void loadAnimations();
    void loadTilesets();
    void loadSystem();
    void loadMap(int mapId);
    void loadMapData(int mapId);
    void setupNewGame();
    void setupBattleTest();
    void importDatabase();
    void extractMetadata(const QJsonObject &obj);
    
    bool isActorsLoaded() const;
    bool isItemsLoaded() const;
    bool isSystemLoaded() const;
    
    static const QString DATABASE_PATH;
    
private:
    DataManager();
    ~DataManager();
    
    bool _actorsLoaded;
    bool _itemsLoaded;
    bool _systemLoaded;
};

#endif // DATAMANAGER_H
