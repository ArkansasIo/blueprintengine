#ifndef QVECTOR_H
#define QVECTOR_H

#include <vector>

template<typename T>
class QVector {
    std::vector<T> data;
public:
    void append(const T& t) { data.push_back(t); }
    void push_back(const T& t) { data.push_back(t); }
    int size() const { return data.size(); }
    int count() const { return data.size(); }
    T& operator[](int i) { return data[i]; }
    const T& operator[](int i) const { return data[i]; }
    bool empty() const { return data.empty(); }
    void clear() { data.clear(); }
    T& front() { return data.front(); }
    T& back() { return data.back(); }
};

#endif // QVECTOR_H
