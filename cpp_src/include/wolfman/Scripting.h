#ifndef WOLFMAN_SCRIPTING_H
#define WOLFMAN_SCRIPTING_H

#include "qstring.h"
#include <functional>

namespace WolfManAlpha {

// Scripting context for game logic
class ScriptContext {
public:
    ScriptContext();
    ~ScriptContext();
    
    // Variable storage
    void setVariable(const QString &name, const QVariant &value);
    QVariant getVariable(const QString &name);
    bool hasVariable(const QString &name) const;
    void removeVariable(const QString &name);
    
    // Function callbacks
    using ScriptFunction = std::function<QVariant(const QVector<QVariant>&)>;
    void registerFunction(const QString &name, ScriptFunction func);
    QVariant callFunction(const QString &name, const QVector<QVariant> &args);
    bool hasFunction(const QString &name) const;
    
    // Flow control
    void wait(float duration);
    void execute(const QString &script);
    
private:
    QMap<QString, QVariant> _variables;
    QMap<QString, ScriptFunction> _functions;
};

// Event scripting
class EventScript {
public:
    EventScript(const QString &name = "");
    ~EventScript();
    
    QString getName() const;
    
    // Script text
    void setScript(const QString &script);
    QString getScript() const;
    
    // Execution
    void execute(ScriptContext* context);
    bool isRunning() const;
    void stop();
    
    // Event hooks
    void onEventStart(const QString &eventName, std::function<void()> callback);
    void onEventEnd(const QString &eventName, std::function<void()> callback);
    
private:
    QString _name;
    QString _script;
    bool _running;
    float _timeElapsed;
};

// Global scripting system
class ScriptingSystem {
public:
    static ScriptingSystem& instance();
    
    // Context management
    ScriptContext* createContext(const QString &name = "");
    ScriptContext* getContext(const QString &name);
    void destroyContext(const QString &name);
    
    // Event script management
    EventScript* createEventScript(const QString &name);
    EventScript* getEventScript(const QString &name);
    void executeEventScript(const QString &scriptName);
    
    // Global functions
    void registerGlobalFunction(const QString &name, ScriptContext::ScriptFunction func);
    
    // Update
    void update(float deltaTime);
    
    // Debug
    void printDebug(const QString &message);
    void setDebugMode(bool enabled);
    
private:
    ScriptingSystem();
    ~ScriptingSystem();
    
    QMap<QString, ScriptContext*> _contexts;
    QMap<QString, EventScript*> _eventScripts;
    bool _debugMode;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_SCRIPTING_H
