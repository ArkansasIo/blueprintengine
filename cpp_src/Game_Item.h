#ifndef GAME_ITEM_H
#define GAME_ITEM_H

#include "qstring.h"

class Game_Item {
public:
    Game_Item(int itemId = 0);
    ~Game_Item();

    void initialize(int itemId);
    bool isNull() const;
    int itemId() const;
    QString name() const;
    QString description() const;
    int price() const;
    int consumable() const;
    int occasion() const;
    int scope() const;
    int speed() const;
    int successRate() const;
    int repeatCount() const;
    int animationId() const;
    QString damage() const;
    QString effects() const;
    bool isSkill() const;
    bool isItem() const;
    bool isUsableItem() const;
    bool isWeapon() const;
    bool isArmor() const;

private:
    int _itemId;
};

#endif // GAME_ITEM_H
