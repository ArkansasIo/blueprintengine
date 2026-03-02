#ifndef GAME_OBJECT_H
#define GAME_OBJECT_H

#include "../utils/Types.h"
#include "qstring.h"

namespace LunaLite {
namespace Core {

class GameObject {
public:
    GameObject(int id = 0);
    virtual ~GameObject();
    
    // Basic properties
    int getId() const;
    void setId(int id);
    
    QString getName() const;
    void setName(const QString &name);
    
    QString getDescription() const;
    void setDescription(const QString &desc);
    
    // Metadata
    int getIconIndex() const;
    void setIconIndex(int index);
    
    virtual void initialize() {}
    virtual void update() {}
    virtual void render() {}
    
protected:
    int _id;
    QString _name;
    QString _description;
    int _iconIndex;
};

} // namespace Core
} // namespace LunaLite

#endif // GAME_OBJECT_H
