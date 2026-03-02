#ifndef WOLFMAN_AUDIO_H
#define WOLFMAN_AUDIO_H

#include "qstring.h"

namespace WolfManAlpha {

enum class AudioSourceType {
    Sound,
    Music,
    Ambience,
    Voice,
    UI
};

class AudioSource {
public:
    AudioSource(const QString &name);
    ~AudioSource();
    
    // Playback
    void play();
    void pause();
    void stop();
    void resume();
    
    // Properties
    void setVolume(float volume);  // 0-1
    void setPitch(float pitch);
    void setLoop(bool loop);
    void setPan(float pan);  // -1 to 1
    
    float getVolume() const;
    float getPitch() const;
    bool isLooping() const;
    bool isPlaying() const;
    
    // Fade
    void fadeIn(float duration);
    void fadeOut(float duration);
    void fadeTo(float targetVolume, float duration);
    
    // Position for 3D sound
    void set3DPosition(float x, float y, float z = 0);
    
    float getDuration() const;
    float getPlaybackTime() const;
    void setPlaybackTime(float time);
    
    void update(float deltaTime);
    
private:
    QString _name;
    float _volume;
    float _pitch;
    bool _loop;
    bool _playing;
    float _playbackTime;
};

class AudioManager {
public:
    static AudioManager& instance();
    
    // Audio loading
    bool loadAudio(const QString &name, const QString &filePath, AudioSourceType type = AudioSourceType::Sound);
    void unloadAudio(const QString &name);
    
    // Audio playback
    AudioSource* playAudio(const QString &name, bool loop = false);
    void stopAudio(const QString &name);
    
    // Global settings
    void setMasterVolume(float volume);
    void setTypeVolume(AudioSourceType type, float volume);
    
    float getMasterVolume() const;
    float getTypeVolume(AudioSourceType type) const;
    
    // Audio queries
    bool hasAudio(const QString &name) const;
    int getAudioCount() const;
    int getPlayingAudioCount() const;
    
    // Audio effects
    void setReverbPreset(int preset);  // 0=None, 1=Small, 2=Medium, 3=Large
    void setEqualizerBand(int band, float gain);
    
    // Update
    void update(float deltaTime);
    void stopAll();
    
private:
    AudioManager();
    ~AudioManager();
    
    QMap<QString, AudioSource*> _audioSources;
    float _masterVolume;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_AUDIO_H
