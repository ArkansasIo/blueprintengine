#ifndef GAME_SCREEN_H
#define GAME_SCREEN_H

#include "qvector.h"
#include "qstring.h"

namespace LunaLite {
namespace Graphics {

class Picture {
public:
    Picture();
    int id;
    QString name;
    float x, y;
    float scaleX, scaleY;
    int opacity;
    float rotation;
    bool visible;
};

class GameScreen {
public:
    static GameScreen& instance();
    
    // Pictures
    void showPicture(int id, const QString &name, int origin, float x, float y,
                     int scaleX = 100, int scaleY = 100, int opacity = 255, int blendMode = 0);
    void movePicture(int id, int duration, int origin, float x, float y,
                     int scaleX = 100, int scaleY = 100, int opacity = 255, int blendMode = 0);
    void rotatePicture(int id, double speed);
    void tintPicture(int id, int r, int g, int b, int intensity, int duration);
    void erasePicture(int id);
    bool isPictureVisible(int id) const;
    
    // Screen effects
    void flashScreen(int r, int g, int b, int intensity, int duration);
    void shakeScreen(int power, int speed, int duration);
    void tintScreen(int r, int g, int b, int intensity, int duration);
    
    // Weather
    void showWeather(int weatherType, int intensity, int duration);
    
    // Brightness
    void setScreenBrightness(int brightness, int duration);
    int getScreenBrightness() const;
    
    // Update and render
    void update();
    void render();
    
    // Clear
    void clear();
    
private:
    GameScreen();
    ~GameScreen();
    
    QVector<Picture> _pictures;
    int _brightness;
    int _weatherType;
    int _weatherIntensity;
};

} // namespace Graphics
} // namespace LunaLite

#endif // GAME_SCREEN_H
