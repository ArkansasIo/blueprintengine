#ifndef QVECTOR_H
#define QVECTOR_H

#include <vector>
#include <algorithm>

class QString;

template<typename T>
class QVector {
    std::vector<T> data;
public:
    using iterator = typename std::vector<T>::iterator;
    using const_iterator = typename std::vector<T>::const_iterator;

    void append(const T& t) { data.push_back(t); }
    void push_back(const T& t) { data.push_back(t); }
    int size() const { return static_cast<int>(data.size()); }
    int count() const { return static_cast<int>(data.size()); }
    T& operator[](int i) { return data[i]; }
    const T& operator[](int i) const { return data[i]; }
    bool empty() const { return data.empty(); }
    void clear() { data.clear(); }
    T& front() { return data.front(); }
    const T& front() const { return data.front(); }
    T& back() { return data.back(); }
    const T& back() const { return data.back(); }
    T& first() { return data.front(); }
    const T& first() const { return data.front(); }
    T& last() { return data.back(); }
    const T& last() const { return data.back(); }
    void remove(int index) {
        if (index >= 0 && index < static_cast<int>(data.size())) {
            data.erase(data.begin() + index);
        }
    }
    int removeAll(const T& value) {
        const auto oldSize = data.size();
        data.erase(std::remove(data.begin(), data.end(), value), data.end());
        return static_cast<int>(oldSize - data.size());
    }
    void removeAt(int index) { remove(index); }
    bool isEmpty() const { return data.empty(); }
    bool contains(const T& value) const {
        return std::find(data.begin(), data.end(), value) != data.end();
    }
    int indexOf(const T& value) const {
        auto it = std::find(data.begin(), data.end(), value);
        if (it == data.end()) {
            return -1;
        }
        return static_cast<int>(std::distance(data.begin(), it));
    }
    iterator begin() { return data.begin(); }
    iterator end() { return data.end(); }
    const_iterator begin() const { return data.begin(); }
    const_iterator end() const { return data.end(); }
    const_iterator cbegin() const { return data.cbegin(); }
    const_iterator cend() const { return data.cend(); }
    QVector<T> mid(int pos, int len = -1) const {
        QVector<T> result;
        if (pos < 0 || pos >= static_cast<int>(data.size())) {
            return result;
        }
        int count = (len < 0) ? (static_cast<int>(data.size()) - pos) : len;
        for (int i = 0; i < count && pos + i < static_cast<int>(data.size()); ++i) {
            result.append(data[pos + i]);
        }
        return result;
    }
    QVector<T> toVector() const { return *this; }
    QString join(const QString& delimiter) const;
};

#endif // QVECTOR_H
