#ifndef GAME_PARTY_H
#define GAME_PARTY_H

#include "qvector.h"
#include "GameObject.h"
#include "GameActorFull.h"
#include "../utils/Types.h"

namespace LunaLite {
namespace Core {

class GameParty : public GameObject {
public:
    static GameParty& instance();
    
    // Party members
    void addActor(int actorId);
    void removeActor(int actorId);
    void clearActors();
    int getActorCount() const;
    GameActorFull* getActor(int index);
    GameActorFull* getActorById(int actorId);
    QVector<GameActorFull*> getActors() const;
    
    // Front member
    GameActorFull* getFrontMember() const;
    GameActorFull* getRandomMember() const;
    
    // Party stats
    int getTotalHp() const;
    int getTotalMp() const;
    int getPartyLevel() const;
    int getAverageLevel() const;
    
    // Items and money
    int getGold() const;
    void setGold(int gold);
    void gainGold(int amount);
    void loseGold(int amount);
    
    int getItemCount(ItemId itemId) const;
    void gainItem(ItemId itemId, int amount);
    void loseItem(ItemId itemId, int amount);
    
    // Skills
    bool isSkillLearned(SkillId skillId) const;
    
    // Checking
    bool isAllDead() const;
    bool isMoving() const;
    
    void initialize() override;
    void update() override;
    
private:
    GameParty();
    ~GameParty();
    
    QVector<GameActorFull*> _actors;
    int _gold;
    QMap<ItemId, int> _items;
};

} // namespace Core
} // namespace LunaLite

#endif // GAME_PARTY_H
