#ifndef WINDOW_COMMAND_H
#define WINDOW_COMMAND_H

#include "Window_Selectable.h"
#include "qstring.h"

class Window_Command : public Window_Selectable {
public:
    Window_Command(const QRect &rect = QRect());
    virtual ~Window_Command();

    virtual void initialize();
    
    void setBackgroundType(int type);
    int windowHeight() const;
    int itemHeight() const;
    virtual int maxItems() const;
    
    void addCommand(const QString &name, const QString &symbol, bool enabled = true);
    void addItem(const QString &name, const QString &symbol);
    void addOriginalCommand(const QString &name, const QString &symbol);
    
    bool isCommandEnabled(int index) const;
    QString commandName(int index) const;
    QString commandSymbol(int index) const;
    
    void drawItem(int index);
    void refresh();
    void updatePlacement();
    void deactivate();
    
private:
    QStringList _list;
    QMap<int, bool> _enabled;
    QMap<int, QString> _symbols;
};

#endif // WINDOW_COMMAND_H
