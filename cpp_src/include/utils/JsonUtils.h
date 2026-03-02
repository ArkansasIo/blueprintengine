#ifndef LUNALITE_JSON_UTILS_H
#define LUNALITE_JSON_UTILS_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

namespace LunaLite {
namespace Serialization {

class JsonUtils {
public:
    // File I/O
    static QJsonDocument loadJson(const QString &filePath);
    static bool saveJson(const QString &filePath, const QJsonDocument &doc);
    
    // Parsing
    static QJsonObject parseJson(const QString &jsonString);
    static QString jsonToString(const QJsonObject &obj);
    
    // Data extraction
    static QString getString(const QJsonObject &obj, const QString &key, const QString &defaultValue = "");
    static int getInt(const QJsonObject &obj, const QString &key, int defaultValue = 0);
    static double getDouble(const QJsonObject &obj, const QString &key, double defaultValue = 0.0);
    static bool getBool(const QJsonObject &obj, const QString &key, bool defaultValue = false);
    static QJsonArray getArray(const QJsonObject &obj, const QString &key);
    static QJsonObject getObject(const QJsonObject &obj, const QString &key);
    
    // Validation
    static bool hasKey(const QJsonObject &obj, const QString &key);
    static bool isValidJson(const QString &jsonString);
};

} // namespace Serialization
} // namespace LunaLite

#endif // LUNALITE_JSON_UTILS_H
