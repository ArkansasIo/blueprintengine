#ifndef IMAGEMANAGER_EX_H
#define IMAGEMANAGER_EX_H

#include "qstring.h"

class ImageManager {
public:
    static ImageManager& instance();
    
    void initialize();
    void *loadBitmap(const QString &url, int hue = 0);
    void *loadBitmapFromUrl(const QString &url);
    void releaseImage(const QString &name);
    
private:
    ImageManager();
    ~ImageManager();
};

#endif // IMAGEMANAGER_EX_H
