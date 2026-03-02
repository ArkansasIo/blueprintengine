#ifndef ANIMATION_H
#define ANIMATION_H

#include "../graphics/Sprite.h"
#include "qvector.h"

namespace LunaLite {
namespace Graphics {

struct AnimationFrame {
    int imageId;
    int duration;
    float scaleX;
    float scaleY;
};

class Animation {
public:
    Animation(int id = 0);
    ~Animation();
    
    int getId() const;
    
    // Frames
    void addFrame(const AnimationFrame &frame);
    void removeFrame(int frameIndex);
    int getFrameCount() const;
    AnimationFrame getFrame(int index) const;
    
    // Playback
    void play();
    void pause();
    void stop();
    void reset();
    
    bool isPlaying() const;
    int getCurrentFrame() const;
    float getProgress() const;
    
    void update();
    
private:
    int _id;
    QVector<AnimationFrame> _frames;
    bool _playing;
    int _currentFrame;
    int _frameTimer;
};

} // namespace Graphics
} // namespace LunaLite

#endif // ANIMATION_H
