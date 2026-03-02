#ifndef SOUNDMANAGER_H
#define SOUNDMANAGER_H

#include "qstring.h"

class SoundManager {
public:
    static SoundManager& instance();
    
    void initialize();
    void playSystemSound(int soundId);
    void playSe(const QString &filename, int volume = 90, int pitch = 100);
    void playMe(const QString &filename, int volume = 100, int pitch = 100);
    void playBgm(const QString &filename, int volume = 90, int pitch = 100);
    void playBgs(const QString &filename, int volume = 80, int pitch = 100);
    void pauseMe();
    void resumeMeBgm();
    void updateSe();
    void updateMe();
    void updateBgm();
    void updateBgs();
    void update();
    void fadeOutBgm(int duration);
    void fadeOutBgs(int duration);
    void fadeInBgm(int duration);
    void fadeInBgs(int duration);
    void stopBgm();
    void stopBgs();
    void stopMe();
    void stopSe();
    
private:
    SoundManager();
    ~SoundManager();
    
    QString _currentBgm;
    QString _currentBgs;
    int _bgmVolume;
    int _bgsVolume;
};

#endif // SOUNDMANAGER_H
