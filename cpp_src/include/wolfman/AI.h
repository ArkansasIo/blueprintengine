#ifndef WOLFMAN_AI_H
#define WOLFMAN_AI_H

#include "qstring.h"
#include "qvector.h"
#include "Physics.h"

namespace WolfManAlpha {

// Behavior tree nodes
class BehaviorNode {
public:
    enum Status { Success, Failure, Running };
    virtual ~BehaviorNode() = default;
    virtual Status execute(float deltaTime) = 0;
};

// Pathfinding
class PathFinder {
public:
    static PathFinder& instance();
    
    // Navigation mesh operations
    bool setNavMesh(const QString &meshName);
    bool loadNavMesh(const QString &filePath);
    
    // Pathfinding
    QVector<Vector2D> findPath(const Vector2D& start, const Vector2D& goal);
    bool isPathValid(const Vector2D& a, const Vector2D& b);
    Vector2D getRandomNavMeshPoint();
    
    // Steering
    Vector2D seek(const Vector2D& position, const Vector2D& target);
    Vector2D flee(const Vector2D& position, const Vector2D& target);
    Vector2D arrive(const Vector2D& position, const Vector2D& target);
    Vector2D wander(const Vector2D& position, float wanderAngle);
    Vector2D pursue(const Vector2D& position, const Vector2D& targetPos, const Vector2D& targetVel);
    Vector2D evade(const Vector2D& position, const Vector2D& targetPos);
    Vector2D separate(const Vector2D& position, const QVector<Vector2D> &neighbors, float radius);
    Vector2D align(const Vector2D &currentVel, const QVector<Vector2D> &neighborVels);
    Vector2D cohesion(const Vector2D &position, const QVector<Vector2D> &neighborPos);
    
    // Path smoothing
    void smoothPath(QVector<Vector2D>& path);
    
private:
    PathFinder();
    ~PathFinder();
    
    QString _currentNavMesh;
};

// Finite State Machine for AI
class AIState {
public:
    virtual ~AIState() = default;
    virtual void onEnter() {}
    virtual void onUpdate(float deltaTime) {}
    virtual void onExit() {}
    virtual bool canTransitionTo(AIState* nextState) { return true; }
};

class AIAgent {
public:
    AIAgent(int id = 0);
    ~AIAgent();
    
    // Agent properties
    int getId() const;
    void setPosition(const Vector2D& pos);
    Vector2D getPosition() const;
    void setMaxSpeed(float speed);
    float getMaxSpeed() const;
    
    // State machine
    void setState(AIState* newState);
    AIState* getCurrentState() const;
    
    // Pathfinding
    void setDestination(const Vector2D& pos);
    bool hasReachedDestination() const;
    void clearPath();
    
    // Update
    void update(float deltaTime);
    
private:
    int _id;
    Vector2D _position;
    Vector2D _velocity;
    float _maxSpeed;
    AIState* _currentState;
    QVector<Vector2D> _path;
    int _pathIndex;
};

// Decision tree
class Decision {
public:
    virtual ~Decision() = default;
    virtual float evaluate(AIAgent* agent) = 0;
};

class DecisionTree {
public:
    DecisionTree();
    ~DecisionTree();
    
    void addDecision(Decision* decision, int priority);
    BehaviorNode::Status evaluate(float deltaTime);
    
private:
    QVector<Decision*> _decisions;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_AI_H
