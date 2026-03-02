#ifndef GAME_ACTORS_H
#define GAME_ACTORS_H

#include "qvector.h"

class Game_Actor;

class Game_Actors {
public:
    Game_Actors();
    ~Game_Actors();

    void initialize();
    Game_Actor *actor(int actorId);
    void addActor(int actorId);
    void removeActor(int actorId);
    
    Game_Actor *leader() const;
    int size() const;
    bool isEmpty() const;
    
    QVector<Game_Actor*> allMembers() const;
    QVector<Game_Actor*> aliveMembers() const;
    QVector<Game_Actor*> deadMembers() const;
    QVector<Game_Actor*> movableMembers() const;
    
private:
    QVector<Game_Actor*> _members;
};

#endif // GAME_ACTORS_H
