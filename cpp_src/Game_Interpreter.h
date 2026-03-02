#ifndef GAME_INTERPRETER_H
#define GAME_INTERPRETER_H

#include "qstring.h"
#include "qstring.h"
#include "qstring.h"

class Game_Interpreter {
public:
    Game_Interpreter(int depth = 0);
    ~Game_Interpreter();

    void initialize();
    void setup(const QList<QString> &list, int eventId = 0);
    
    bool isRunning() const;
    bool isWaiting() const;
    bool isPaused() const;
    
    void update();
    void executeCommand();
    int itemExists(int paramIndex) const;
    QString currentCommand() const;
    int currentIndent() const;
    
    bool isEventRunning() const;
    void waitCount() const;
    
    void command111ShowConditions();
    void command112ShowLoopCount();
    void command113Comment();
    void command114PluginCommand();
    void command200ControlVariables();
    void command204ControlCharacterMovement();
    void command205TransferPlayer();
    void command206SetEventLocation();
    void command207Scroll();
    void command208SetMovementRoute();
    void command209Wait();
    void command210ShowPicture();
    void command211MovePicture();
    void command212RotatePicture();
    void command213TintPicture();
    void command214ErasePicture();
    void command215ShowWeather();
    void command216PlayBGM();
    void command217PlayBGS();
    void command218PlayME();
    void command219PlaySE();
    void command220StopBGM();
    void command221StopBGS();
    void command222StopME();
    void command223StopSE();
    void command230ShowText();
    void command231ShowChoices();
    void command232InputNumber();
    void command233SelectItem();
    void command250ShowScrollingText();
    void command301Battle();
    void command302Shop();
    void command303Name();
    void command304HideName();
    void command305ChangeWindowskin();
    void command306ChangeActorImages();
    void command307ChangeVehicleImage();
    void command308ChangeSystemSettings();
    void command309DisableFormationCommand();
    void command310PartyWindowDisable();
    void command311Show();
    void command312Erase();
    void command313SetEventPriority();
    void command314SetEventTrigger();
    void command315SetEventImage();
    void command316ChangeTransparency();

private:
    int _depth;
    int _eventId;
    int _index;
    int _indent;
    QList<QString> _list;
    QMap<int, int> _parameters;
    bool _running;
    bool _waiting;
    bool _paused;
};

#endif // GAME_INTERPRETER_H
