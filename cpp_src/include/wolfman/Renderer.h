#ifndef WOLFMAN_RENDERER_H
#define WOLFMAN_RENDERER_H

#include "qstring.h"
#include "qvector.h"
#include "qcolor.h"

namespace WolfManAlpha {

struct DrawCommand {
    enum Type { Sprite, Text, Shape, Line, Quad };
    Type type;
    int layer;
    QString resourceName;
    float x, y;
    float scaleX, scaleY;
    float rotation;
    int color;
    int opacity;
};

class Renderer {
public:
    static Renderer& instance();
    
    // Rendering setup
    bool initialize(int width, int height);
    void beginFrame();
    void endFrame();
    void present();
    
    // Drawing primitives
    void drawSprite(const QString &name, float x, float y, float scaleX = 1.0f,
                    float scaleY = 1.0f, float rotation = 0, int color = 0xFFFFFFFF, int layer = 0);
    void drawText(const QString &text, float x, float y, int fontSize = 16,
                  const QString &fontName = "Arial", int color = 0x000000FF, int layer = 0);
    void drawRectangle(float x, float y, float width, float height,
                       int fillColor = 0xFFFFFFFF, int outlineColor = -1, int layer = 0);
    void drawCircle(float x, float y, float radius,
                    int fillColor = 0xFFFFFFFF, int outlineColor = -1, int layer = 0);
    void drawLine(float x1, float y1, float x2, float y2, int color = 0x000000FF,
                  float thickness = 1.0f, int layer = 0);
    void drawPolygon(const QVector<float> &vertices, int color = 0xFFFFFFFF, int layer = 0);
    
    // Screen effects
    void setBlendMode(int mode);  // 0=Normal, 1=Add, 2=Multiply, 3=Screen
    void setClippingRegion(float x, float y, float width, float height);
    void clearClippingRegion();
    
    // Camera/Viewport
    void setCameraPosition(float x, float y);
    void setCameraZoom(float zoom);
    void setCameraRotation(float rotation);
    
    // Screen properties
    int getScreenWidth() const;
    int getScreenHeight() const;
    void setScreenSize(int width, int height);
    
    // Rendering stats
    int getDrawCallCount() const;
    int getVisibleObjectCount() const;
    
    // Clear and reset
    void clear(int color = 0x000000FF);
    
private:
    Renderer();
    ~Renderer();
    
    int _width, _height;
    int _drawCallCount;
    QVector<DrawCommand> _commandBuffer;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_RENDERER_H
