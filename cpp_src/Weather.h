#ifndef WEATHER_H
#define WEATHER_H

#include "qstring.h"

class Weather {
public:
    Weather();
    ~Weather();

    void initialize();
    void update();
    
    void setType(const QString &type);
    void setPower(int power);
    void setDuration(int duration);
    
    QString type() const;
    int power() const;
    int duration() const;
    
    void refresh();
    
private:
    QString _type;
    int _power;
    int _duration;
};

#endif // WEATHER_H
