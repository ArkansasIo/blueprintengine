#ifndef WINDOW_BASE_H
#define WINDOW_BASE_H

#include "qstring.h"
#include "qstring.h"

class Window_Base {
public:
    Window_Base(const QRect &rect = QRect());
    virtual ~Window_Base();

    virtual void initialize();
    virtual void update();
    virtual void move(int x, int y, int width, int height);
    
    int x() const;
    int y() const;
    int width() const;
    int height() const;
    
    void show();
    void hide();
    void activate();
    void deactivate();
    bool active() const;
    bool visible() const;
    
    void setBackgroundType(int type);
    void setWindowskin(const QString &filename);
    
    void drawText(int x, int y, int width, int height, const QString &text);
    void drawActorName(int actorId, int x, int y);
    void drawActorClass(int actorId, int x, int y);
    void drawActorHp(int actorId, int x, int y, int width = 186);
    void drawActorMp(int actorId, int x, int y, int width = 186);
    void drawActorTp(int actorId, int x, int y, int width = 96);
    void drawActorSimpleStatus(int actorId, int x, int y);
    void drawItemName(int itemId, int x, int y, int width = 312);
    void drawCurrentAndMax(int current, int max, int x, int y, int width, const QString &color1, const QString &color2);
    void drawGauge(int x, int y, int width, double rate, const QString &color1, const QString &color2);
    void drawIcon(int iconIndex, int x, int y);
    void drawFace(const QString &faceName, int faceIndex, int x, int y, int width = 144, int height = 144);
    
    int textWidth(const QString &text) const;
    int lineHeight() const;
    int standardPadding() const;
    int fittingHeight(int numLines) const;
    
    void createContents();
    void contents() const;
    
protected:
    QRect _rect;
    bool _visible;
    bool _active;
    int _padding;
    QString _windowskin;
};

#endif // WINDOW_BASE_H
