#ifndef RESOURCE_MANAGER_H
#define RESOURCE_MANAGER_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

namespace LunaLite {
namespace Managers {

class ResourceManager {
public:
    static ResourceManager& instance();
    
    // Image resources
    bool loadImage(const QString &name, const QString &filePath);
    void unloadImage(const QString &name);
    QPixmap* getImage(const QString &name);
    bool hasImage(const QString &name) const;
    void clearImages();
    
    // Audio resources
    bool loadAudio(const QString &name, const QString &filePath);
    void unloadAudio(const QString &name);
    bool hasAudio(const QString &name) const;
    void clearAudio();
    
    // Data files
    bool loadDataFile(const QString &name, const QString &filePath);
    QString getDataFile(const QString &name) const;
    bool hasDataFile(const QString &name) const;
    void clearDataFiles();
    
    // Memory management
    int getMemoryUsage() const;  // Returns approximate memory in KB
    void clearAllResources();
    void preloadResourcesForMap(int mapId);
    
private:
    ResourceManager();
    ~ResourceManager();
    
    QMap<QString, QPixmap*> _images;
    QMap<QString, QString> _audioFiles;  // name -> filepath
    QMap<QString, QString> _dataFiles;   // name -> content/path
};

} // namespace Managers
} // namespace LunaLite

#endif // RESOURCE_MANAGER_H
