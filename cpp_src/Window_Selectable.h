#ifndef WINDOW_SELECTABLE_H
#define WINDOW_SELECTABLE_H

#include "Window_Base.h"

class Window_Selectable : public Window_Base {
public:
    Window_Selectable(const QRect &rect = QRect());
    Window_Selectable(int x, int y, int width, int height);
    virtual ~Window_Selectable();

    virtual void initialize();
    virtual void update();
    
    int index() const;
    void setIndex(int index);
    
    int row() const;
    int topRow() const;
    void setTopRow(int row);
    
    int itemHeight() const;
    int maxCols() const;
    int maxItems() const;
    
    void activate();
    void deactivate();
    void select(int index);
    void forceSelect(int index);
    void deselect();
    
    bool cursorDown(bool wrap);
    bool cursorUp(bool wrap);
    bool cursorRight(bool wrap);
    bool cursorLeft(bool wrap);
    bool cursorPageDown();
    bool cursorPageUp();
    
    void processCursorMove();
    void processHandling();
    void processTouch();
    
    virtual bool isCurrentItemEnabled() const;
    bool isTouchOkEnabled() const;
    bool isOkEnabled() const;
    bool isCancelEnabled() const;
    bool isOkTriggered() const;
    bool isCancelTriggered() const;

protected:
    int _index;
    int _cursorFixValue;
    
    virtual int contentsHeight() const;
    virtual int itemRectWithPadding(int index) const;
    virtual int itemLineRect(int index) const;
    virtual int itemRect(int index) const;
};

#endif // WINDOW_SELECTABLE_H
