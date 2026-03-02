#ifndef INPUT_HANDLER_H
#define INPUT_HANDLER_H

#include "qobject.h"
#include "qstring.h"
#include "qstring.h"

class InputHandler : public QObject {
    Q_OBJECT

public:
    enum Key {
        KEY_UP,
        KEY_DOWN,
        KEY_LEFT,
        KEY_RIGHT,
        KEY_OK,
        KEY_CANCEL,
        KEY_MENU,
        KEY_SHIFT,
        KEY_TAB,
        KEY_PAGEUP,
        KEY_PAGEDOWN,
        KEY_DEBUG
    };

    static InputHandler& instance();
    
    void initialize();
    void update();
    
    // Input checking
    bool isPressed(Key key) const;
    bool isTriggered(Key key) const;
    bool isRepeated(Key key) const;
    
    // Direction input
    int getDirectionInput() const;  // 2,4,6,8 or 0
    bool isDiagonalEnabled() const;
    
    // Text input
    void startTextInput(int maxLength = 20);
    void endTextInput();
    QString getInputText() const;
    
    // Touch input
    bool isTouchActive() const;
    int getTouchX() const;
    int getTouchY() const;
    
private:
    InputHandler();
    ~InputHandler();
    
    QSet<Key> _pressedKeys;
    QSet<Key> _triggeredKeys;
    QMap<Key, int> _repeatCounters;
    
    QString _inputText;
    bool _textInputActive;
    
    int _touchX, _touchY;
    bool _touchActive;
};

#endif // INPUT_HANDLER_H
