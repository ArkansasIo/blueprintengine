#ifndef QCOLOR_H
#define QCOLOR_H

#include "qstring.h"

class QColor {
private:
    int r, g, b, a;
public:
    QColor() : r(0), g(0), b(0), a(255) {}
    QColor(int rr, int gg, int bb, int aa = 255) : r(rr), g(gg), b(bb), a(aa) {}
    int red() const { return r; }
    int green() const { return g; }
    int blue() const { return b; }
    int alpha() const { return a; }
};

#endif
