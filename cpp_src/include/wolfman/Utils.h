#ifndef WOLFMAN_UTILS_H
#define WOLFMAN_UTILS_H

#include "qstring.h"
#include "qvector.h"
#include <cmath>

namespace WolfManAlpha {
namespace Utils {

// Math utilities
class Math {
public:
    static const float PI;
    static const float TAU;
    static const float DEG_TO_RAD;
    static const float RAD_TO_DEG;
    
    static float degrees(float radians) { return radians * RAD_TO_DEG; }
    static float radians(float degrees) { return degrees * DEG_TO_RAD; }
    
    static float sin(float x) { return std::sin(x); }
    static float cos(float x) { return std::cos(x); }
    static float tan(float x) { return std::tan(x); }
    
    static float sqrt(float x) { return std::sqrt(x); }
    static float pow(float x, float y) { return std::pow(x, y); }
    static float abs(float x) { return std::abs(x); }
    
    template<typename T>
    static T clamp(T value, T min, T max) {
        return (value < min) ? min : (value > max) ? max : value;
    }
    
    template<typename T>
    static T lerp(T a, T b, float t) {
        return a + (b - a) * t;
    }
    
    static float smoothstep(float t) {
        return t * t * (3.0f - 2.0f * t);
    }
};

// String utilities
class String {
public:
    static QVector<QString> split(const QString &str, const QString &delimiter);
    static QString join(const QVector<QString> &parts, const QString &delimiter);
    static QString toLower(const QString &str);
    static QString toUpper(const QString &str);
    static bool startsWith(const QString &str, const QString &prefix);
    static bool endsWith(const QString &str, const QString &suffix);
    static QString trim(const QString &str);
    static QString replace(const QString &str, const QString &from, const QString &to);
};

// Random utilities
class Random {
public:
    static float randomFloat(float min = 0.0f, float max = 1.0f);
    static int randomInt(int min, int max);
    static bool randomBool();
    static float randomAngle();
};

// Conversion utilities
class Convert {
public:
    static QString toString(int value);
    static QString toString(float value);
    static QString toString(bool value);
    
    static int toInt(const QString &str);
    static float toFloat(const QString &str);
    static bool toBool(const QString &str);
};

// Color utilities
class Color {
public:
    static int rgba(int r, int g, int b, int a = 255);
    static int rgb(int r, int g, int b);
    static void getRgba(int color, int& r, int& g, int& b, int& a);
};

} // namespace Utils
} // namespace WolfManAlpha

#endif // WOLFMAN_UTILS_H
