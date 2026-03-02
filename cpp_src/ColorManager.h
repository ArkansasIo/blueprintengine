#ifndef COLORMANAGER_H
#define COLORMANAGER_H

#include "qcolor.h"

class ColorManager {
public:
    static ColorManager& instance();
    
    void initialize();
    QColor textColor(int id) const;
    QColor normalColor() const;
    QColor systemColor() const;
    QColor crisisColor() const;
    QColor deathColor() const;
    QColor gaugeBackColor() const;
    QColor hpGaugeColor1() const;
    QColor hpGaugeColor2() const;
    QColor mpGaugeColor1() const;
    QColor mpGaugeColor2() const;
    
private:
    ColorManager();
    ~ColorManager();
};

#endif // COLORMANAGER_H
