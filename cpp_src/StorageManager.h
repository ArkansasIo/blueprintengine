#ifndef STORAGE_MANAGER_H
#define STORAGE_MANAGER_H

#include "qstring.h"
#include "qstring.h"

class StorageManager {
public:
    static StorageManager& instance();
    
    void initialize();
    bool saveToLocalFile(const QString &filename, const QByteArray &data);
    QByteArray loadFromLocalFile(const QString &filename);
    bool fileExists(const QString &filename) const;
    void deleteFile(const QString &filename);
    
    // Cloud storage support (optional)
    bool saveToCloud(const QString &key, const QByteArray &data);
    QByteArray loadFromCloud(const QString &key);
    
private:
    StorageManager();
    ~StorageManager();
    QString _savePath;
};

#endif // STORAGE_MANAGER_H
