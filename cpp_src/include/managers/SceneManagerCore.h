#ifndef SCENE_MANAGER_CORE_H
#define SCENE_MANAGER_CORE_H

#include "SceneBase.h"
#include "qstring.h"

namespace LunaLite {
namespace Managers {

class SceneManager {
public:
    static SceneManager& instance();
    
    // Scene management
    void changeScene(Scenes::SceneBase* scene);
    void pushScene(Scenes::SceneBase* scene);
    void popScene();
    void popAll();
    
    // Current scene
    Scenes::SceneBase* getCurrentScene() const;
    Scenes::SceneBase* getPreviousScene() const;
    
    // Scene stack queries
    int getSceneCount() const;
    bool isSceneActive() const;
    bool isSceneReady() const;
    
    // Update loop
    void update();
    void render();
    
    // Scene info
    QString getCurrentSceneName() const;
    
private:
    SceneManager();
    ~SceneManager();
    
    QStack<Scenes::SceneBase*> _sceneStack;
    Scenes::SceneBase* _currentScene;
};

} // namespace Managers
} // namespace LunaLite

#endif // SCENE_MANAGER_CORE_H
