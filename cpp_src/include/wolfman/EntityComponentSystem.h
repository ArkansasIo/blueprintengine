#ifndef WOLFMAN_ENTITY_COMPONENT_SYSTEM_H
#define WOLFMAN_ENTITY_COMPONENT_SYSTEM_H

#include "qstring.h"
#include "qvector.h"
#include <memory>
#include <typeinfo>

namespace WolfManAlpha {

// Base component class
class Component {
public:
    virtual ~Component() = default;
    virtual void initialize() {}
    virtual void update(float deltaTime) {}
    virtual void onEnable() {}
    virtual void onDisable() {}
    bool isEnabled() const { return _enabled; }
    void setEnabled(bool enabled) { _enabled = enabled; }
    
protected:
    bool _enabled = true;
};

// Entity class
class Entity {
public:
    Entity(const QString &name = "");
    ~Entity();
    
    // Identity
    int getId() const;
    QString getName() const;
    void setName(const QString &name);
    
    // Components
    template<typename T>
    void addComponent(std::shared_ptr<T> component) {
        const std::type_info& type = typeid(T);
        _components[type.name()] = std::static_pointer_cast<Component>(component);
    }
    
    template<typename T>
    std::shared_ptr<T> getComponent() {
        const std::type_info& type = typeid(T);
        auto it = _components.find(type.name());
        if (it != _components.end()) {
            return std::static_pointer_cast<T>(it.value());
        }
        return nullptr;
    }
    
    template<typename T>
    bool hasComponent() {
        const std::type_info& type = typeid(T);
        return _components.contains(type.name());
    }
    
    template<typename T>
    void removeComponent() {
        const std::type_info& type = typeid(T);
        _components.remove(type.name());
    }
    
    // Children
    void addChild(std::shared_ptr<Entity> child);
    void removeChild(std::shared_ptr<Entity> child);
    int getChildCount() const;
    std::shared_ptr<Entity> getChild(int index);
    
    // Lifecycle
    void initialize();
    void update(float deltaTime);
    bool isActive() const;
    void setActive(bool active);
    
private:
    static int _nextId;
    int _id;
    QString _name;
    bool _active;
    QMap<QString, std::shared_ptr<Component>> _components;
    QVector<std::shared_ptr<Entity>> _children;
};

// Entity manager / Scene graph
class EntityManager {
public:
    static EntityManager& instance();
    
    // Entity creation/destruction
    std::shared_ptr<Entity> createEntity(const QString &name = "");
    void destroyEntity(int entityId);
    void destroyAllEntities();
    
    // Entity queries
    std::shared_ptr<Entity> getEntity(int id);
    std::shared_ptr<Entity> findEntityByName(const QString &name);
    QVector<std::shared_ptr<Entity>> getAllEntities();
    int getEntityCount() const;
    
    // Update
    void updateAll(float deltaTime);
    void renderAll();
    
    // Layers
    void setEntityLayer(int entityId, int layer);
    int getEntityLayer(int entityId) const;
    
private:
    EntityManager();
    ~EntityManager();
    
    int _nextEntityId;
    QMap<int, std::shared_ptr<Entity>> _entities;
    QMap<int, int> _entityLayers;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_ENTITY_COMPONENT_SYSTEM_H
