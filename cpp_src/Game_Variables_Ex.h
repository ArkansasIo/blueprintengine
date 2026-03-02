#ifndef GAME_VARIABLES_H
#define GAME_VARIABLES_H

#include "qstring.h"

class Game_Variables {
public:
    Game_Variables();
    ~Game_Variables();

    void initialize();
    int value(int variableId) const;
    void setValue(int variableId, int value);
    QString label(int variableId) const;
    void setLabel(int variableId, const QString &label);
    void clear();
    void onChange();

private:
    QMap<int, int> _data;
    QMap<int, QString> _labels;
};

#endif // GAME_VARIABLES_H
