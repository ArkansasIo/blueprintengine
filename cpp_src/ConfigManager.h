#ifndef CONFIGMANAGER_H
#define CONFIGMANAGER_H

#include "qstring.h"
#include "qstring.h"

class ConfigManager {
public:
    static ConfigManager& instance();
    
    void initialize();
    void load();
    void save();
    
    bool alwaysDash() const;
    void setAlwaysDash(bool value);
    
    bool commandRemember() const;
    void setCommandRemember(bool value);
    
    int bgmVolume() const;
    void setBgmVolume(int value);
    
    int bgsVolume() const;
    void setBgsVolume(int value);
    
    int meVolume() const;
    void setMeVolume(int value);
    
    int seVolume() const;
    void setSeVolume(int value);
    
    bool touchUI() const;
    void setTouchUI(bool value);
    
    bool vibration() const;
    void setVibration(bool value);
    
    bool debugMode() const;
    void setDebugMode(bool value);
    
private:
    ConfigManager();
    ~ConfigManager();
    
    QMap<QString, bool> _boolValues;
    QMap<QString, int> _intValues;
};

#endif // CONFIGMANAGER_H
