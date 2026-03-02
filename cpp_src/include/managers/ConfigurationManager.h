#ifndef CONFIGURATION_MANAGER_H
#define CONFIGURATION_MANAGER_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

namespace LunaLite {
namespace Managers {

class ConfigurationManager {
public:
    static ConfigurationManager& instance();
    
    // Load/Save config
    bool loadConfig(const QString &filePath);
    bool saveConfig(const QString &filePath);
    
    // General settings
    QString getGameTitle() const;
    void setGameTitle(const QString &title);
    
    // Screen
    int getScreenWidth() const;
    int getScreenHeight() const;
    void setScreenSize(int width, int height);
    
    bool isFullscreen() const;
    void setFullscreen(bool fullscreen);
    
    // Audio
    int getMasterVolume() const;
    void setMasterVolume(int volume);
    
    // Difficulty
    enum GameDifficulty { Easy, Normal, Hard, Nightmare };
    GameDifficulty getDifficulty() const;
    void setDifficulty(GameDifficulty difficulty);
    
    // Debug
    bool isDebugEnabled() const;
    void setDebugEnabled(bool enabled);
    
    // Text
    bool getAllowSaveAnywhereOption() const;
    bool getAllowLoadAnywhereOption() const;
    
    // Generic get/set
    QVariant getValue(const QString &key, const QVariant &defaultValue = QVariant()) const;
    void setValue(const QString &key, const QVariant &value);
    
    // Reset to defaults
    void resetToDefaults();
    
private:
    ConfigurationManager();
    ~ConfigurationManager();
    
    QMap<QString, QVariant> _config;
    
    void initializeDefaults();
};

} // namespace Managers
} // namespace LunaLite

#endif // CONFIGURATION_MANAGER_H
