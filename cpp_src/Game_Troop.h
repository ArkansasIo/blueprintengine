#ifndef GAME_TROOP_H
#define GAME_TROOP_H

#include "qstring.h"

class Game_Troop {
public:
    Game_Troop();
    ~Game_Troop();

    void initialize();
    void setup(int troopId);
    int troopId() const;
    QString name() const;
    bool canEscape() const;
    bool canLose() const;
    QList<int> members() const;
    int size() const;
    bool isEmpty() const;
    bool isEventRunning() const;
    bool needsPageCheck() const;
    int currentPageIndex() const;
    void setupBattleEvent();
    void updateInterpreter();
    void turnCount() const;
    void makeUniqueNames();
    void replaceMemberImage(int index, const QString &characterName, int characterIndex);
    void clearAllBattleResults();
    void displayDropItems();
    void displayExp();
    void displayGold();
    void displayLevelUp();

private:
    int _troopId;
    QList<int> _enemies;
    bool _canEscape;
    bool _canLose;
};

#endif // GAME_TROOP_H
