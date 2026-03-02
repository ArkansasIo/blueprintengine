#ifndef IMAGEMANAGER_H
#define IMAGEMANAGER_H

#include "qstring.h"
#include "qstring.h"

class Bitmap;

class ImageManager_Base {
public:
    static ImageManager_Base& instance();
    
    Bitmap *loadSystem(const QString &filename);
    Bitmap *loadBattle1(const QString &filename);
    Bitmap *loadBattle2(const QString &filename);
    Bitmap *loadBattleback1(const QString &filename);
    Bitmap *loadBattleback2(const QString &filename);
    Bitmap *loadCharacter(const QString &filename);
    Bitmap *loadFace(const QString &filename);
    Bitmap *loadParallax(const QString &filename);
    Bitmap *loadPicture(const QString &filename);
    Bitmap *loadTileset(const QString &filename);
    Bitmap *loadTitle1(const QString &filename);
    Bitmap *loadTitle2(const QString &filename);
    void releaseReservation(const QString &key);
    void releaseReservations();
    
private:
    ImageManager_Base();
    ~ImageManager_Base();
    
    QMap<QString, Bitmap*> _cache;
};

#endif // IMAGEMANAGER_H
