#ifndef WINDOW_BASE_H
#define WINDOW_BASE_H

#include "../graphics/Sprite.h"
#include "qstring.h"

namespace LunaLite {
namespace UI {

class WindowBase : public Graphics::Sprite {
public:
    WindowBase(int x, int y, int width, int height);
    virtual ~WindowBase();
    
    // Dimensions
    int getWidth() const;
    int getHeight() const;
    void setWidth(int width);
    void setHeight(int height);
    void setDimensions(int width, int height);
    
    // Padding/Margins
    int getPadding() const;
    void setPadding(int padding);
    
    // Background color
    int getBackColor() const;
    void setBackColor(int color);
    
    // Content area
    void clearContents();
    
    // Cursor
    int getCursorIndex() const;
    void setCursorIndex(int index);
    void moveCursor(int offset);
    
    // Active/Enabled state
    bool isActive() const;
    void setActive(bool active);
    
    bool isEnabled() const;
    void setEnabled(bool enabled);
    
    // Open/Close
    bool isOpen() const;
    void open();
    void close();
    
    virtual void update() override;
    
protected:
    int _width;
    int _height;
    int _padding;
    int _backColor;
    int _cursorIndex;
    bool _active;
    bool _enabled;
    bool _open;
};

} // namespace UI
} // namespace LunaLite

#endif // WINDOW_BASE_H
