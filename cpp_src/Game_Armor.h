#ifndef GAME_ARMOR_H
#define GAME_ARMOR_H

#include "qstring.h"

class Game_Armor {
public:
    Game_Armor(int armorId);
    ~Game_Armor();

    int armorId() const;
    int armorType() const;
    int price() const;
    bool canEquip() const;
    
    QString name() const;
    QString description() const;
    QString iconIndex() const;
    
private:
    int _armorId;
};

#endif // GAME_ARMOR_H
