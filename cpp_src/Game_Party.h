#ifndef GAME_PARTY_H
#define GAME_PARTY_H

#include "qstring.h"

class Game_Actor;

class Game_Party {
public:
    Game_Party();
    ~Game_Party();

    void initialize();
    void setupStartingMembers();
    void setupBattleTest();
    void setupBattleTestMembers();
    void addActor(int actorId);
    void removeActor(int actorId);
    bool contains(int actorId) const;
    QList<Game_Actor*> allMembers() const;
    QList<Game_Actor*> battleMembers() const;
    int numItems(int itemId) const;
    int maxItems() const;
    bool hasItem(int itemId) const;
    bool canUse(int itemId) const;
    int itemContainer(int itemId) const;
    void gainItem(int itemId, int amount);
    void loseItem(int itemId, int amount);
    void consumeItem(int itemId);
    bool canConsume(int itemId) const;
    bool canPayCost(const QString &cost) const;
    void payWindowCost(const QString &cost);
    int gold() const;
    void gainGold(int amount);
    void loseGold(int amount);
    int maxGold() const;
    int steps() const;
    void increaseSteps();
    bool inBattle() const;
    void onPlayerWalk();
    QString encounterProgressValue() const;
    
private:
    QList<int> _actors;
    QMap<int, int> _items;
    int _gold;
    int _steps;
    bool _inBattle;
};

#endif // GAME_PARTY_H
