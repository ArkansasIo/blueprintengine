#ifndef QMAP_H
#define QMAP_H

#include <map>

template<typename K, typename V>
class QMap : public std::map<K,V> {
public:
    bool contains(const K& k) const { return std::map<K,V>::find(k) != std::map<K,V>::end(); }
};

#endif // QMAP_H
