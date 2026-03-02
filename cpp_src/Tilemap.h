#ifndef TILEMAP_H
#define TILEMAP_H

#include "qstring.h"

class Tilemap {
public:
    Tilemap();
    ~Tilemap();

    void initialize(int mapId);
    void refresh();
    void update();
    
    void setBitmaps(const QStringList &filenames);
    void setDisplayPos(int x, int y);
    void setOrigin(int x, int y);
    
    int originX() const;
    int originY() const;
    
private:
    int _mapId;
    int _displayX;
    int _displayY;
    int _originX;
    int _originY;
};

#endif // TILEMAP_H
