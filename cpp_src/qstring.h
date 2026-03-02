#ifndef QSTRING_H
#define QSTRING_H

#include <string>
#include <vector>
#include <map>
#include <cstdlib>
#include <algorithm>
#include <iostream>

typedef unsigned int uint;
typedef unsigned short ushort;
typedef unsigned char uchar;

// Minimal Qt stub implementations for compilation

class QString : public std::string {
public:
    QString() : std::string() {}
    QString(const char* str) : std::string(str ? str : "") {}
    QString(const std::string& str) : std::string(str) {}
    const char* toLatin1() const { return c_str(); }
    const char* toStdString() const { return c_str(); }
    int length() const { return static_cast<int>(size()); }
    QString mid(int pos, int len = -1) const {
        if (len < 0) return QString(substr(pos));
        return QString(substr(pos, len));
    }
    QString toUpper() const {
        QString r(*this);
        for (char& c : r) c = std::toupper(c);
        return r;
    }
    QString toLower() const {
        QString r(*this);
        for (char& c : r) c = std::tolower(c);
        return r;
    }
    static QString number(int n) { return QString(std::to_string(n)); }
    static QString number(double d) { return QString(std::to_string(d)); }
};

class QVariant {
private:
    std::string data;
public:
    QVariant() {}
    QVariant(const QString& s) : data(s) {}
    QVariant(int i) : data(std::to_string(i)) {}
    QVariant(double d) : data(std::to_string(d)) {}
    QVariant(bool b) : data(b ? "true" : "false") {}
    QString toString() const { return QString(data); }
    int toInt() const { return atoi(data.c_str()); }
    double toDouble() const { return atof(data.c_str()); }
    bool toBool() const { return data == "true" || data == "1"; }
};

class QObject {
public:
    virtual ~QObject() {}
};

class QWidget : public QObject {
public:
    virtual ~QWidget() {}
    void show() {}
    void hide() {}
    void setWindowTitle(const QString&) {}
    void resize(int, int) {}
};

class QApplication {
public:
    QApplication(int&, char**) {}
    static int exec() { return 0; }
    static QApplication* instance() { return nullptr; }
};

class QPainter {
public:
    void drawRect(int,int,int,int) {}
};

class QColor {
public:
    QColor() {}
    QColor(int,int,int) {}
};

class QImage {
public:
    QImage() {}
    QImage(int,int,int) {}
    int width() const { return 0; }
    int height() const { return 0;}
};

class QPixmap {
public:
    QPixmap() {}
    QPixmap(const QString&) {}
};

class QTimer : public QObject {
public:
    void start(int) {}
    void stop() {}
};

class QRect {
public:
    int x,y,w,h;
    QRect() : x(0),y(0),w(0),h(0) {}
    QRect(int xx, int yy, int ww, int hh) : x(xx),y(yy),w(ww),h(hh) {}
    int width() const { return w; }
    int height() const { return h; }
};

class QPoint {
public:
    int x,y;
    QPoint() : x(0),y(0) {}
    QPoint(int xx, int yy) : x(xx),y(yy) {}
};

class QSize {
public:
    int w,h;
    QSize() : w(0),h(0) {}
    QSize(int ww, int hh) : w(ww),h(hh) {}
    int width() const { return w; }
    int height() const { return h; }
};

class QFile {
private:
    bool opened = false;
public:
    QFile() {}
    QFile(const QString&) {}
    bool open(int = 0) { opened = true; return true; }
    void close() { opened = false; }
    bool isOpen() const { return opened; }
    QString readAll() { return QString(""); }
};

// Template containers - simplified to avoid MSVC issues

template<typename T>
class QList : public std::vector<T> {
public:
    void append(const T& t) { this->push_back(t); }
    int size() const { return (int)std::vector<T>::size(); }
    int count() const { return (int)std::vector<T>::size(); }
};

template<typename K, typename V>
class QMap : public std::map<K,V> {
public:
    bool contains(const K& k) const { return std::map<K,V>::find(k) != std::map<K,V>::end(); }
};

template<typename T>
class QVector : public std::vector<T> {
public:
    void append(const T& t) { this->push_back(t); }
    int size() const { return (int)std::vector<T>::size(); }
    int count() const { return (int)std::vector<T>::size(); }
};

inline int qBound(int min, int v, int max) {
    return v < min ? min : (v > max ? max : v);
}

inline double qBound(double min, double v, double max) {
    return v < min ? min : (v > max ? max : v);
}

#define Q_OBJECT
#define signals public
#define slots
#define emit
#define Q_PROPERTY(x)
#define Q_ENUM(x)
#define Q_INTERFACE(x)
#define Q_INVOKABLE
#define Q_SLOT
#define Q_SIGNAL

#endif
