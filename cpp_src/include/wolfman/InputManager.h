#ifndef WOLFMAN_INPUT_H
#define WOLFMAN_INPUT_H

#include "qstring.h"
#include <functional>

namespace WolfManAlpha {

enum class KeyCode {
    // Letters
    A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z,
    // Numbers
    Num0, Num1, Num2, Num3, Num4, Num5, Num6, Num7, Num8, Num9,
    // Function keys
    F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
    // Arrow keys
    Up, Down, Left, Right,
    // Special
    Space, Enter, Escape, Tab, Shift, Control, Alt, Delete, Backspace,
    // Numpad
    NumpadEnter, NumpadMinus, NumpadPlus,
    // Mouse buttons
    MouseLeft, MouseRight, MouseMiddle,
    // Gamepad
    GamepadA, GamepadB, GamepadX, GamepadY,
    GamepadLB, GamepadRB, GamepadLT, GamepadRT,
    GamepadStart, GamepadBack,
    GamepadLeftThumb, GamepadRightThumb,
    GamepadDpadUp, GamepadDpadDown, GamepadDpadLeft, GamepadDpadRight
};

enum class InputType {
    Keyboard,
    Mouse,
    Gamepad,
    Touch,
    Custom
};

using InputCallback = std::function<void(KeyCode, InputType)>;

class InputManager {
public:
    static InputManager& instance();
    
    // Key input
    bool isKeyDown(KeyCode key);
    bool isKeyPressed(KeyCode key);  // First frame
    bool isKeyReleased(KeyCode key);
    
    // Mouse input
    int getMouseX() const;
    int getMouseY() const;
    float getMouseDeltaX() const;
    float getMouseDeltaY() const;
    int getMouseWheelDelta() const;
    bool isMouseButtonDown(KeyCode button);
    
    // Gamepad input
    float getGamepadAxisX(int gamepadIndex = 0) const;
    float getGamepadAxisY(int gamepadIndex = 0) const;
    float getGamepadTriggerLeft(int gamepadIndex = 0) const;
    float getGamepadTriggerRight(int gamepadIndex = 0) const;
    bool isGamepadConnected(int gamepadIndex) const;
    int getGamepadCount() const;
    
    // Touch input
    int getTouchCount() const;
    float getTouchX(int index) const;
    float getTouchY(int index) const;
    bool isTouchActive(int index) const;
    
    // Input callbacks/events
    void onKeyDown(InputCallback callback);
    void onKeyUp(InputCallback callback);
    void onMouseMove(std::function<void(int, int)> callback);
    
    // Device queries
    bool hasKeyboard() const;
    bool hasMouse() const;
    bool hasGamepad() const;
    bool hasTouchScreen() const;
    
    // Update
    void update();
    void reset();
    
private:
    InputManager();
    ~InputManager();
    
    QMap<KeyCode, bool> _keyDown;
    QMap<KeyCode, bool> _keyPressed;
    QMap<KeyCode, bool> _keyReleased;
    
    int _mouseX, _mouseY;
    float _mouseDeltaX, _mouseDeltaY;
    int _mouseWheelDelta;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_INPUT_H
