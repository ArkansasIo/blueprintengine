#ifndef WOLFMAN_PHYSICS_H
#define WOLFMAN_PHYSICS_H

#include "qvector.h"

namespace WolfManAlpha {

struct Vector2D {
    float x, y;
    
    Vector2D() : x(0), y(0) {}
    Vector2D(float x, float y) : x(x), y(y) {}
    
    Vector2D operator+(const Vector2D& v) const { return Vector2D(x + v.x, y + v.y); }
    Vector2D operator-(const Vector2D& v) const { return Vector2D(x - v.x, y - v.y); }
    Vector2D operator*(float scalar) const { return Vector2D(x * scalar, y * scalar); }
    
    float magnitude() const { return std::sqrt(x * x + y * y); }
    Vector2D normalized() const {
        float mag = magnitude();
        return mag > 0 ? Vector2D(x / mag, y / mag) : Vector2D(0, 0);
    }
    
    float dot(const Vector2D& v) const { return x * v.x + y * v.y; }
};

struct RigidBody {
    Vector2D position;
    Vector2D velocity;
    Vector2D acceleration;
    float mass;
    float friction;
    float restitution;  // Bounciness
    bool isKinematic;
    bool useGravity;
    
    RigidBody() : mass(1.0f), friction(0.1f), restitution(0.5f),
                  isKinematic(false), useGravity(true) {}
};

struct Collider {
    enum Type { Circle, Box, Polygon };
    Type type;
    float width, height;
    float radius;
    bool isTrigger;
    
    Collider() : type(Box), width(1.0f), height(1.0f), radius(0.5f), isTrigger(false) {}
};

class Physics {
public:
    static Physics& instance();
    
    // Gravity and environment
    Vector2D getGravity() const;
    void setGravity(float x, float y);
    
    // Physics simulation
    void simulate(float deltaTime);
    void applyForce(int entityId, const Vector2D& force);
    void applyImpulse(int entityId, const Vector2D& impulse);
    
    // Collision detection
    bool checkCollision(int entity1, int entity2);
    bool raycast(const Vector2D& origin, const Vector2D& direction, float maxDistance);
    QVector<int> overlapCircle(const Vector2D& center, float radius);
    QVector<int> overlapBox(const Vector2D& center, float width, float height);
    
    // Constraint-based physics
    void addDistanceConstraint(int entity1, int entity2, float distance);
    void addHingeConstraint(int entityId, const Vector2D& pivot);
    
    // Sleep/Wake
    void sleep(int entityId);
    void wake(int entityId);
    bool isAsleep(int entityId) const;
    
private:
    Physics();
    ~Physics();
    
    Vector2D _gravity;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_PHYSICS_H
