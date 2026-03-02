#ifndef QLIST_H
#define QLIST_H

#include <vector>

template<typename T>
class QList : public std::vector<T> {
public:
    void append(const T& t) { this->push_back(t); }
    int size() const { return (int)std::vector<T>::size(); }
    int count() const { return (int)std::vector<T>::size(); }
};

#endif // QLIST_H
