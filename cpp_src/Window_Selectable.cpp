#include "Window_Selectable.h"

Window_Selectable::Window_Selectable(const QRect &rect)
    : Window_Base(rect), _index(0), _cursorFixValue(0) {
}


Window_Selectable::Window_Selectable(int x, int y, int width, int height)
    : Window_Base(QRect(x, y, width, height)), _index(0), _cursorFixValue(0) {
}
Window_Selectable::~Window_Selectable() {
}

void Window_Selectable::initialize() {
    Window_Base::initialize();
}

void Window_Selectable::update() {
    Window_Base::update();
    if (active()) {
        processCursorMove();
        processHandling();
    }
}

int Window_Selectable::index() const {
    return _index;
}

void Window_Selectable::setIndex(int index) {
    _index = qMax(0, qMin(index, maxItems() - 1));
}

int Window_Selectable::row() const {
    return _index / maxCols();
}

int Window_Selectable::topRow() const {
    return 0;
}

void Window_Selectable::setTopRow(int row) {
}

int Window_Selectable::itemHeight() const {
    return lineHeight();
}

int Window_Selectable::maxCols() const {
    return 1;
}

int Window_Selectable::maxItems() const {
    return 0;
}

void Window_Selectable::activate() {
    Window_Base::activate();
}

void Window_Selectable::deactivate() {
    Window_Base::deactivate();
}

void Window_Selectable::select(int index) {
    setIndex(index);
}

void Window_Selectable::forceSelect(int index) {
    setIndex(index);
}

void Window_Selectable::deselect() {
    _index = -1;
}

bool Window_Selectable::cursorDown(bool wrap) {
    int index = _index + maxCols();
    if (index >= maxItems() && wrap) {
        index = 0;
    }
    if (index < maxItems()) {
        setIndex(index);
        return true;
    }
    return false;
}

bool Window_Selectable::cursorUp(bool wrap) {
    int index = _index - maxCols();
    if (index < 0 && wrap) {
        index = maxItems() - 1;
    }
    if (index >= 0) {
        setIndex(index);
        return true;
    }
    return false;
}

bool Window_Selectable::cursorRight(bool wrap) {
    int index = _index + 1;
    if (index >= maxItems() && wrap) {
        index = 0;
    }
    if (index < maxItems()) {
        setIndex(index);
        return true;
    }
    return false;
}

bool Window_Selectable::cursorLeft(bool wrap) {
    int index = _index - 1;
    if (index < 0 && wrap) {
        index = maxItems() - 1;
    }
    if (index >= 0) {
        setIndex(index);
        return true;
    }
    return false;
}

bool Window_Selectable::cursorPageDown() {
    return false;
}

bool Window_Selectable::cursorPageUp() {
    return false;
}

void Window_Selectable::processCursorMove() {
}

void Window_Selectable::processHandling() {
}

void Window_Selectable::processTouch() {
}

bool Window_Selectable::isCurrentItemEnabled() const {
    return true;
}

bool Window_Selectable::isTouchOkEnabled() const {
    return true;
}

bool Window_Selectable::isOkEnabled() const {
    return true;
}

bool Window_Selectable::isCancelEnabled() const {
    return true;
}

bool Window_Selectable::isOkTriggered() const {
    return false;
}

bool Window_Selectable::isCancelTriggered() const {
    return false;
}

int Window_Selectable::contentsHeight() const {
    return maxItems() * itemHeight();
}

int Window_Selectable::itemRectWithPadding(int index) const {
    return 0;
}

int Window_Selectable::itemLineRect(int index) const {
    return 0;
}

int Window_Selectable::itemRect(int index) const {
    return 0;
}
