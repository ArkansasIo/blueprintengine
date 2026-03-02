#ifndef SCENE_BASE_H
#define SCENE_BASE_H

#include "GameObject.h"
#include "qstring.h"

namespace LunaLite {
namespace Scenes {

class SceneBase : public Core::GameObject {
public:
    SceneBase(const QString &name = "");
    virtual ~SceneBase();
    
    QString getSceneName() const;
    
    // Scene lifecycle
    virtual void start();
    virtual void update();
    virtual void render();
    virtual void stop();
    
    // Scene queries
    bool isActive() const;
    bool isReady() const;
    int getUpdateCount() const;
    
    void initialize() override;
    
protected:
    QString _sceneName;
    bool _active;
    bool _ready;
    int _updateCount;
};

} // namespace Scenes
} // namespace LunaLite

#endif // SCENE_BASE_H
