#ifndef QMAP_H
#define QMAP_H

#include <map>
#include "qvector.h"

template<typename K, typename V>
class QMap {
public:
    class iterator {
    public:
        iterator() = default;
        explicit iterator(typename std::map<K, V>::iterator it) : _it(it) {}
        V& value() { return _it->second; }
        const V& value() const { return _it->second; }
        const K& key() const { return _it->first; }
        iterator& operator++() { ++_it; return *this; }
        bool operator==(const iterator& other) const { return _it == other._it; }
        bool operator!=(const iterator& other) const { return _it != other._it; }
        V& operator*() { return _it->second; }
        V* operator->() { return &(_it->second); }
    private:
        typename std::map<K, V>::iterator _it;
    };

    class const_iterator {
    public:
        const_iterator() = default;
        explicit const_iterator(typename std::map<K, V>::const_iterator it) : _it(it) {}
        const V& value() const { return _it->second; }
        const K& key() const { return _it->first; }
        const_iterator& operator++() { ++_it; return *this; }
        bool operator==(const const_iterator& other) const { return _it == other._it; }
        bool operator!=(const const_iterator& other) const { return _it != other._it; }
        const V& operator*() const { return _it->second; }
        const V* operator->() const { return &(_it->second); }
    private:
        typename std::map<K, V>::const_iterator _it;
    };

    bool contains(const K& k) const { return _data.find(k) != _data.end(); }
    int size() const { return static_cast<int>(_data.size()); }
    bool empty() const { return _data.empty(); }
    void clear() { _data.clear(); }

    V value(const K& key, const V& defaultValue) const {
        auto it = _data.find(key);
        return it != _data.end() ? it->second : defaultValue;
    }

    V value(const K& key) const {
        auto it = _data.find(key);
        return it != _data.end() ? it->second : V();
    }

    void remove(const K& key) { _data.erase(key); }

    QVector<V> values() const {
        QVector<V> out;
        for (const auto& item : _data) {
            out.append(item.second);
        }
        return out;
    }

    QVector<K> keys() const {
        QVector<K> out;
        for (const auto& item : _data) {
            out.append(item.first);
        }
        return out;
    }

    V& operator[](const K& key) { return _data[key]; }
    const V& operator[](const K& key) const { return _data.at(key); }

    iterator find(const K& key) { return iterator(_data.find(key)); }
    const_iterator find(const K& key) const { return const_iterator(_data.find(key)); }
    iterator begin() { return iterator(_data.begin()); }
    iterator end() { return iterator(_data.end()); }
    const_iterator begin() const { return const_iterator(_data.begin()); }
    const_iterator end() const { return const_iterator(_data.end()); }
    const_iterator constBegin() const { return const_iterator(_data.cbegin()); }
    const_iterator constEnd() const { return const_iterator(_data.cend()); }

private:
    std::map<K, V> _data;
};

#endif // QMAP_H
