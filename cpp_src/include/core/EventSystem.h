#ifndef EVENT_SYSTEM_H
#define EVENT_SYSTEM_H

#include <functional>
#include "qstring.h"
#include "qvector.h"
#include "qstring.h"

namespace LunaLite {
namespace Events {

using EventCallback = std::function<void(const QString&, const QMap<QString, QVariant>&)>;

class Event {
public:
    Event(const QString &name);
    
    QString getName() const;
    void addListener(EventCallback callback);
    void dispatch(const QMap<QString, QVariant> &data);
    
private:
    QString _name;
    QVector<EventCallback> _listeners;
};

class EventManager {
public:
    static EventManager& instance();
    
    void registerEvent(const QString &eventName);
    void subscribe(const QString &eventName, EventCallback callback);
    void dispatch(const QString &eventName, const QMap<QString, QVariant> &data = {});
    void clear();
    
private:
    EventManager();
    ~EventManager();
    
    QMap<QString, Event*> _events;
};

} // namespace Events
} // namespace LunaLite

#endif // EVENT_SYSTEM_H
