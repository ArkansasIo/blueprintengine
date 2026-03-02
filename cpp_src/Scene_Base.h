#ifndef SCENE_BASE_H
#define SCENE_BASE_H

#include "qstring.h"

class Scene_Base {
public:
    Scene_Base();
    virtual ~Scene_Base();

    virtual void initialize();
    virtual void create();
    virtual void start();
    virtual void update();
    virtual void stop();
    virtual void terminate();
    
    bool isReady() const;
    bool isActive() const;
    bool isTransitioning() const;
    
    bool isRequested() const;
    void setTransitionColor(int r, int g, int b);
    void setTransitionSpeed(int speed);
    
protected:
    bool _ready;
    bool _active;
    bool _transitioning;
    int _transitionCount;
    int _transitionSpeed;
};

#endif // SCENE_BASE_H
