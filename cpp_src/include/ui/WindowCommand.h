#ifndef WINDOW_COMMAND_H
#define WINDOW_COMMAND_H

#include "WindowBase.h"
#include "qvector.h"
#include "qstring.h"

namespace LunaLite {
namespace UI {

class WindowCommand : public WindowBase {
public:
    WindowCommand(int x, int y, int width);
    virtual ~WindowCommand();
    
    // Commands
    void addCommand(const QString &name);
    void removeCommand(int index);
    void clearCommands();
    
    int getCommandCount() const;
    QString getCommand(int index) const;
    
    // Selection
    int getSelectedIndex() const;
    void selectItem(int index);
    void selectNext();
    void selectPrev();
    void selectOk();
    
    // Enable/Disable specific items
    void enableCommand(int index);
    void disableCommand(int index);
    bool isCommandEnabled(int index) const;
    
    // Callbacks
    using CommandCallback = std::function<void(int)>;
    void setOkCallback(CommandCallback callback);
    void setCancelCallback(CommandCallback callback);
    
    virtual void update() override;
    
protected:
    QVector<QString> _commands;
    QVector<bool> _enabled;
    CommandCallback _okCallback;
    CommandCallback _cancelCallback;
};

} // namespace UI
} // namespace LunaLite

#endif // WINDOW_COMMAND_H
