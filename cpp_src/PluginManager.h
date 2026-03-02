#ifndef PLUGINMANAGER_H
#define PLUGINMANAGER_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

class PluginManager {
public:
    static PluginManager& instance();
    
    void initialize();
    void loadPlugins();
    void setup(const QStringList &plugins);
    void callCommand(const QString &command);
    void registerCommand(const QString &name, int commandCode);
    bool isPlugin(const QString &name) const;
    QString version(const QString &name) const;
    void setParameters(const QString &name, const QMap<QString, QString> &params);
    QMap<QString, QString> parameters(const QString &name) const;
    
private:
    PluginManager();
    ~PluginManager();
    
    QMap<QString, QString> _plugins;
    QMap<QString, QMap<QString, QString>> _parameters;
    QList<QString> _loadedPlugins;
};

#endif // PLUGINMANAGER_H
