#ifndef GAME_SCREEN_H
#define GAME_SCREEN_H

class Game_Screen {
public:
    Game_Screen();
    ~Game_Screen();

    void initialize();
    void update();
    int brightness() const;
    void setBrightness(int brightness);
    int tone() const;
    void setTone(int r, int g, int b, int gray = 0, int duration = 0);
    void startTint(int r, int g, int b, int gray, int duration);
    void flash(int red, int green, int blue, int duration);
    void shake(int power, int speed, int duration);
    void startShake(int power, int speed, int duration);
    void showPicture(int pictureId, const QString &name, int origin, int x, int y, 
                     int scaleX = 100, int scaleY = 100, int opacity = 255, int blendMode = 0);
    void movePicture(int pictureId, int origin, int x, int y, 
                     int scaleX = 100, int scaleY = 100, int opacity = 255, int duration = 0);
    void rotatePicture(int pictureId, int speed);
    void tintPicture(int pictureId, int r, int g, int b, int gray, int duration);
    void erasePicture(int pictureId);
    int weatherPower() const;
    void setWeatherPower(int power);
    int weather() const;
    void changeWeather(const QString &type, int power, int duration);
    
private:
    int _brightness;
    int _weatherPower;
    QString _weatherType;
};

#endif // GAME_SCREEN_H
