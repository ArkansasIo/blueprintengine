#ifndef TEXT_MANAGER_H
#define TEXT_MANAGER_H

#include "qstring.h"
#include "qstring.h"

class TextManager {
public:
    static TextManager& instance();
    
    void initialize();
    QString basic(int id) const;
    QString params(int id) const;
    
    QString states(int id) const;
    QString skill(int id) const;
    QString item(int id) const;
    QString weapon(int id) const;
    QString armor(int id) const;
    QString enemy(int id) const;
    QString actor(int id) const;
    
    void setBasic(int id, const QString &text);
    void setParams(int id, const QString &text);
    
private:
    TextManager();
    ~TextManager();
    
    QMap<int, QString> _basic;
    QMap<int, QString> _params;
};

#endif // TEXT_MANAGER_H
