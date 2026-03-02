#ifndef WOLFMAN_PARTICLE_SYSTEM_H
#define WOLFMAN_PARTICLE_SYSTEM_H

#include "qstring.h"
#include "qvector.h"
#include "Physics.h"

namespace WolfManAlpha {

struct Particle {
    Vector2D position;
    Vector2D velocity;
    Vector2D acceleration;
    float lifetime;
    float maxLifetime;
    float scale;
    int color;
    int opacity;
    float rotation;
    QString texture;
    
    Particle() : lifetime(1.0f), maxLifetime(1.0f), scale(1.0f),
                 color(0xFFFFFFFF), opacity(255), rotation(0) {}
};

class ParticleEmitter {
public:
    ParticleEmitter();
    virtual ~ParticleEmitter();
    
    // Properties
    void setPosition(float x, float y);
    void setEmissionRate(int particlesPerSecond);
    void setParticleLifetime(float minTime, float maxTime);
    void setInitialVelocity(float minX, float maxX, float minY, float maxY);
    void setInitialScale(float min, float max);
    void setInitialColor(int startColor, int endColor);
    
    // Emission
    void play();
    void pause();
    void stop();
    bool isPlaying() const;
    
    // Update and rendering
    void update(float deltaTime);
    const QVector<Particle>& getParticles() const;
    
    // Emission shapes
    void setShape(int shape);  // 0=Point, 1=Circle, 2=Box, 3=Line
    void setSpread(float angle, float spread);
    
private:
    Vector2D _position;
    int _emissionRate;
    float _minLifetime, _maxLifetime;
    bool _playing;
    float _emissionCounter;
    QVector<Particle> _particles;
    int _shape;
};

class ParticleSystem {
public:
    static ParticleSystem& instance();
    
    // Create emitters
    ParticleEmitter* createEmitter(const QString &name);
    ParticleEmitter* getEmitter(const QString &name);
    void destroyEmitter(const QString &name);
    
    // Global simulation
    void update(float deltaTime);
    void render();
    
    // Presets
    void createExplosionEffect(float x, float y, int particleCount = 50);
    void createSmokEffect(float x, float y);
    void createSparkEffect(float x, float y, float angle);
    void createRainEffect(int width, int height, int particleCount = 1000);
    
private:
    ParticleSystem();
    ~ParticleSystem();
    
    QMap<QString, ParticleEmitter*> _emitters;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_PARTICLE_SYSTEM_H
