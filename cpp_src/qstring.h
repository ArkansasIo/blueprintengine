#ifndef QSTRING_H
#define QSTRING_H

#include <string>
#include <vector>
#include <map>
#include <cctype>
#include <cstdlib>
#include <algorithm>
#include <fstream>
#include <cstdio>

#include "qvector.h"
#include "qmap.h"
#include "qlist.h"

typedef unsigned int uint;
typedef unsigned short ushort;
typedef unsigned char uchar;

// Minimal Qt stub implementations for compilation

class QStringList;
class QByteArray;

class QString : public std::string {
public:
    QString() : std::string() {}
    QString(const char* str) : std::string(str ? str : "") {}
    QString(const std::string& str) : std::string(str) {}
    const char* toLatin1() const { return c_str(); }
    const char* toStdString() const { return c_str(); }
    QByteArray toUtf8() const;
    int length() const { return static_cast<int>(size()); }
    bool isEmpty() const { return empty(); }
    int toInt() const { return atoi(c_str()); }
    double toFloat() const { return atof(c_str()); }
    QString& replace(const QString& before, const QString& after) {
        size_t pos = 0;
        while ((pos = find(before, pos)) != std::string::npos) {
            std::string::replace(pos, before.length(), after);
            pos += after.length();
        }
        return *this;
    }
    QString mid(int pos, int len = -1) const {
        if (len < 0) return QString(substr(pos));
        return QString(substr(pos, len));
    }
    bool startsWith(const QString& prefix) const {
        return size() >= prefix.size() && compare(0, prefix.size(), prefix) == 0;
    }
    bool endsWith(const QString& suffix) const {
        return size() >= suffix.size() &&
               compare(size() - suffix.size(), suffix.size(), suffix) == 0;
    }
    bool contains(const QString& text) const {
        return find(text) != std::string::npos;
    }
    QString trimmed() const {
        size_t beginPos = 0;
        size_t endPos = size();
        while (beginPos < endPos && std::isspace(static_cast<unsigned char>((*this)[beginPos]))) {
            ++beginPos;
        }
        while (endPos > beginPos && std::isspace(static_cast<unsigned char>((*this)[endPos - 1]))) {
            --endPos;
        }
        return QString(substr(beginPos, endPos - beginPos));
    }
    QString replace(const QString& before, const QString& after) const {
        QString copy(*this);
        copy.replace(before, after);
        return copy;
    }
    QStringList split(const QString& delimiter) const;
    QString arg(int value) const {
        return replace(QString("%1"), QString::number(value));
    }
    QString arg(const QString& value) const {
        return replace(QString("%1"), value);
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
    static QString fromUtf8(const char* text) { return QString(text); }
    static QString fromUtf8(const std::string& text) { return QString(text); }
};

class QByteArray : public std::string {
public:
    QByteArray() : std::string() {}
    QByteArray(const char* value) : std::string(value ? value : "") {}
    QByteArray(const std::string& value) : std::string(value) {}
};

inline QByteArray QString::toUtf8() const {
    return QByteArray(*this);
}

inline QByteArray toUtf8(const QString& value) {
    return QByteArray(value);
}

namespace QIODevice {
    enum OpenMode {
        ReadOnly = 1,
        WriteOnly = 2
    };
}

class QStringList : public QVector<QString> {
public:
    QVector<QString> toVector() const { return *this; }
    QString join(const QString& delimiter) const {
        QString result;
        for (int i = 0; i < size(); ++i) {
            if (i > 0) {
                result += delimiter;
            }
            result += (*this)[i];
        }
        return result;
    }
};

inline QStringList QString::split(const QString& delimiter) const {
    QStringList parts;
    if (delimiter.empty()) {
        parts.append(*this);
        return parts;
    }
    size_t start = 0;
    size_t pos = find(delimiter, start);
    while (pos != std::string::npos) {
        parts.append(substr(start, pos - start));
        start = pos + delimiter.size();
        pos = find(delimiter, start);
    }
    parts.append(substr(start));
    return parts;
}

template<typename T>
inline QString QVector<T>::join(const QString& delimiter) const {
    QString result;
    for (int i = 0; i < size(); ++i) {
        if (i > 0) {
            result += delimiter;
        }
        result += static_cast<QString>((*this)[i]);
    }
    return result;
}

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

#ifndef QOBJECT_CLASS_DEFINED
#define QOBJECT_CLASS_DEFINED
class QObject {
public:
    virtual ~QObject() {}
};
#endif

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
    QByteArray readAll() { return QByteArray(""); }
    int write(const QByteArray&) { return 0; }
};

class QDir {
public:
    QDir() {}
    explicit QDir(const QString&) {}
    static bool mkpath(const QString&) { return true; }
};

class QJsonArray;
class QJsonObject;

class QJsonValue {
public:
    QJsonValue() = default;
    QJsonValue(const QString& value) : _variant(value) {}
    QJsonValue(int value) : _variant(value) {}
    QJsonValue(double value) : _variant(value) {}
    QJsonValue(bool value) : _variant(value) {}

    QString toString(const QString& defaultValue = "") const {
        const QString value = _variant.toString();
        return value.empty() ? defaultValue : value;
    }
    int toInt(int defaultValue = 0) const {
        const int value = _variant.toInt();
        return value == 0 ? defaultValue : value;
    }
    double toDouble(double defaultValue = 0.0) const {
        const double value = _variant.toDouble();
        return value == 0.0 ? defaultValue : value;
    }
    bool toBool(bool defaultValue = false) const {
        const bool value = _variant.toBool();
        return value ? true : defaultValue;
    }
    QJsonArray toArray() const;
    QJsonObject toObject() const;

private:
    QVariant _variant;
};

class QJsonArray : public QVector<QJsonValue> {
public:
    QJsonArray() = default;
};

class QJsonObject : public QMap<QString, QJsonValue> {
public:
    QJsonObject() = default;
    QJsonValue value(const QString& key) const {
        return QMap<QString, QJsonValue>::value(key, QJsonValue());
    }
};

inline QJsonArray QJsonValue::toArray() const {
    return QJsonArray();
}

inline QJsonObject QJsonValue::toObject() const {
    return QJsonObject();
}

class QJsonDocument {
public:
    enum JsonFormat {
        Compact = 0,
        Indented = 1
    };

    QJsonDocument() : _isObject(false), _isNull(true) {}
    explicit QJsonDocument(const QJsonObject& object) : _object(object), _isObject(true), _isNull(false) {}

    static QJsonDocument fromJson(const QByteArray&) {
        return QJsonDocument(QJsonObject());
    }

    QByteArray toJson(JsonFormat = Compact) const {
        return QByteArray("{}");
    }

    bool isObject() const { return _isObject; }
    bool isNull() const { return _isNull; }
    QJsonObject object() const { return _object; }

private:
    QJsonObject _object;
    bool _isObject;
    bool _isNull;
};

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

inline int qBound(int min, int v, int max) {
    return v < min ? min : (v > max ? max : v);
}

inline double qBound(double min, double v, double max) {
    return v < min ? min : (v > max ? max : v);
}

template<typename T>
inline T qMin(const T& a, const T& b) {
    return (a < b) ? a : b;
}

template<typename T>
inline T qMax(const T& a, const T& b) {
    return (a > b) ? a : b;
}

#endif
