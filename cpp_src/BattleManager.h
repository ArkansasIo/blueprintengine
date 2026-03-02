#ifndef BATTLEMANAGER_H
#define BATTLEMANAGER_H

#include "qstring.h"
#include "qstring.h"

class BattleManager {
public:
    static BattleManager& instance();
    
    void initialize();
    void setup(int troopId, bool canEscape, bool canLose);
    void initMembers();
    void startBattle();
    void update();
    void updateEvent();
    void updateEventMain();
    void isBusy() const;
    void isInputting() const;
    void isInTurn() const;
    void isTurnEnd() const;
    void isAbort() const;
    void isWaiting() const;
    int battlePhase() const;
    int canEscape() const;
    int canLose() const;
    void setActionState(const QString &state);
    bool isActionForced() const;
    void forceAction(int battlerId);
    void processForcedAction();
    int makeActionOrders();
    int startTurn();
    void updateTurn();
    void endTurn();
    void abortBattle();
    void checkBattleEnd();
    bool checkTroopEscape();
    bool checkAbort2();
    void processVictory();
    void processEscape();
    void processAbort();
    void makeRewards();
    void displayRewards();
    bool makeEscapeRatio() const;
    
private:
    BattleManager();
    ~BattleManager();
    
    int _troopId;
    bool _canEscape;
    bool _canLose;
    bool _isBattle;
    QString _phase;
    int _turn;
};

#endif // BATTLEMANAGER_H
