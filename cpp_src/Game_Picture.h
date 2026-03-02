#ifndef GAME_PICTURE_H
#define GAME_PICTURE_H

#include "qstring.h"

class Game_Picture {
public:
    Game_Picture(int pictureId);
    ~Game_Picture();

    int pictureId() const;
    void show(const QString &name, int origin, int x, int y, int scaleX = 100, 
             int scaleY = 100, int opacity = 255, int blendMode = 0);
    void move(int duration, int origin, int x, int y, int scaleX = 100, 
             int scaleY = 100, int opacity = 255, int blendMode = 0);
    void rotate(int speed);
    void tint(int red, int green, int blue, int gray, int duration);
    void erase();
    void update();
    
private:
    int _pictureId;
};

#endif // GAME_PICTURE_H
