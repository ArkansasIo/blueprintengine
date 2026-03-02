#ifndef SPRITE_H
#define SPRITE_H

#include "../core/GameObject.h"
#include "qstring.h"

namespace LunaLite {
namespace Graphics {

class Sprite : public Core::GameObject {
public:
    Sprite(int id = 0);
    virtual ~Sprite();
    
    // Position
    float getX() const;
    float getY() const;
    void setX(float x);
    void setY(float y);
    void setPosition(float x, float y);
    
    // Scale
    float getScaleX() const;
    float getScaleY() const;
    void setScaleX(float scale);
    void setScaleY(float scale);
    void setScale(float x, float y);
    
    // Rotation
    float getRotation() const;
    void setRotation(float rotation);
    
    // Opacity
    int getOpacity() const;
    void setOpacity(int opacity);
    
    // Visibility
    bool isVisible() const;
    void setVisible(bool visible);
    
    // Frame/Animation
    int getFrameIndex() const;
    void setFrameIndex(int index);
    
    // Bitmap/Image
    QString getBitmapName() const;
    void setBitmapName(const QString &name);
    
    // Interaction
    bool isClickable() const;
    void setClickable(bool clickable);
    
    void initialize() override;
    void update() override;
    
protected:
    float _x, _y;
    float _scaleX, _scaleY;
    float _rotation;
    int _opacity;
    bool _visible;
    int _frameIndex;
    QString _bitmapName;
    bool _clickable;
};

} // namespace Graphics
} // namespace LunaLite

#endif // SPRITE_H
