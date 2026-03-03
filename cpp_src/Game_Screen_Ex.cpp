#include "Game_Screen_Ex.h"

Game_Screen::Game_Screen() : _brightness(255), _weatherPower(0) {
}

Game_Screen::~Game_Screen() {
}

void Game_Screen::initialize() {
    _brightness = 255;
    _weatherPower = 0;
    _weatherType = "none";
}

void Game_Screen::update() {
}

int Game_Screen::brightness() const {
    return _brightness;
}

void Game_Screen::setBrightness(int brightness) {
    _brightness = qBound(0, brightness, 255);
}

int Game_Screen::tone() const {
    return 0;
}

void Game_Screen::setTone(int r, int g, int b, int gray, int duration) {
}

void Game_Screen::startTint(int r, int g, int b, int gray, int duration) {
}

void Game_Screen::flash(int red, int green, int blue, int duration) {
}

void Game_Screen::shake(int power, int speed, int duration) {
}

void Game_Screen::startShake(int power, int speed, int duration) {
}

void Game_Screen::showPicture(int pictureId, const QString &name, int origin, int x, int y, 
                              int scaleX, int scaleY, int opacity, int blendMode) {
}

void Game_Screen::movePicture(int pictureId, int origin, int x, int y, 
                              int scaleX, int scaleY, int opacity, int duration) {
}

void Game_Screen::rotatePicture(int pictureId, int speed) {
}

void Game_Screen::tintPicture(int pictureId, int r, int g, int b, int gray, int duration) {
}

void Game_Screen::erasePicture(int pictureId) {
}

int Game_Screen::weatherPower() const {
    return _weatherPower;
}

void Game_Screen::setWeatherPower(int power) {
    _weatherPower = qBound(0, power, 9);
}

int Game_Screen::weather() const {
    return 0;
}

void Game_Screen::changeWeather(const QString &type, int power, int duration) {
    _weatherType = type;
    _weatherPower = power;
}
