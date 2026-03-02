#ifndef AUDIO_MANAGER_H
#define AUDIO_MANAGER_H

#include "qstring.h"
#include "qstring.h"

namespace LunaLite {
namespace Managers {

enum AudioType {
    BGM,       // Background Music
    BGS,       // Background Sound
    SE,        // Sound Effect
    ME         // Music Effect (plays over BGM)
};

class AudioManager {
public:
    static AudioManager& instance();
    
    // BGM
    void playBgm(const QString &filename, int volume = 100, float pitch = 1.0f);
    void pauseBgm();
    void resumeBgm();
    void stopBgm(float fadeTime = 0.0f);
    
    // BGS
    void playBgs(const QString &filename, int volume = 100, float pitch = 1.0f);
    void pauseBgs();
    void resumeBgs();
    void stopBgs(float fadeTime = 0.0f);
    
    // ME (plays once)
    void playMe(const QString &filename, int volume = 100, float pitch = 1.0f);
    void stopMe();
    
    // SE (plays instantly)
    void playSe(const QString &filename, int volume = 100, float pitch = 1.0f);
    void stopSe(int seId);
    void stopAllSe();
    
    // Volume control
    void setMasterVolume(int volume);
    void setBgmVolume(int volume);
    void setBgsVolume(int volume);
    void setSeVolume(int volume);
    
    int getMasterVolume() const;
    int getBgmVolume() const;
    int getBgsVolume() const;
    int getSeVolume() const;
    
    // Status
    bool isBgmPlaying() const;
    bool isBgsPlaying() const;
    bool isMePlaying() const;
    
    // Fade
    void fadeBgm(float time);
    void fadeBgs(float time);
    
    // Clear all
    void clear();
    
private:
    AudioManager();
    ~AudioManager();
    
    int _masterVolume;
    int _bgmVolume;
    int _bgsVolume;
    int _seVolume;
    
    QString _currentBgm;
    QString _currentBgs;
    bool _bgmPlaying;
    bool _bgsPlaying;
    bool _mePlaying;
};

} // namespace Managers
} // namespace LunaLite

#endif // AUDIO_MANAGER_H
