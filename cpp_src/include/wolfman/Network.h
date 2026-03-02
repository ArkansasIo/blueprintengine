#ifndef WOLFMAN_NETWORK_H
#define WOLFMAN_NETWORK_H

#include "qstring.h"
#include "qvector.h"
#include <functional>

namespace WolfManAlpha {

// Network protocol structures
struct NetworkPacket {
    int id;
    int packetType;
    QVector<uint8_t> data;
    int size;
};

struct NetworkMessage {
    QString sender;
    QString type;
    QMap<QString, QString> data;
};

// Network connection
class NetworkPeer {
public:
    NetworkPeer(const QString &address, int port);
    ~NetworkPeer();
    
    QString getAddress() const;
    int getPort() const;
    bool isConnected() const;
    
    // Communication
    void sendMessage(const NetworkMessage& message);
    void sendPacket(const NetworkPacket& packet);
    
    // Callbacks
    void onMessageReceived(std::function<void(const NetworkMessage&)> callback);
    void onConnected(std::function<void()> callback);
    void onDisconnected(std::function<void()> callback);
    void onError(std::function<void(const QString&)> callback);
    
private:
    QString _address;
    int _port;
    bool _connected;
};

// Network server
class NetworkServer {
public:
    NetworkServer(int port);
    ~NetworkServer();
    
    bool start();
    void stop();
    bool isRunning() const;
    
    int getPort() const;
    int getClientCount() const;
    
    // Broadcasting
    void broadcastMessage(const NetworkMessage& message);
    void sendToClient(const QString &clientId, const NetworkMessage& message);
    
    // Callbacks
    void onClientConnected(std::function<void(const QString&)> callback);
    void onClientDisconnected(std::function<void(const QString&)> callback);
    void onMessageReceived(std::function<void(const QString&, const NetworkMessage&)> callback);
    
private:
    int _port;
    bool _running;
    QMap<QString, NetworkPeer*> _clients;
};

// Network manager
class NetworkManager {
public:
    static NetworkManager& instance();
    
    // Connection
    bool connectToServer(const QString &address, int port);
    void disconnectFromServer();
    bool isConnected() const;
    
    // Hosting
    bool startServer(int port);
    void stopServer();
    bool isServer() const;
    
    // Messaging
    void sendMessage(const NetworkMessage& message);
    void broadcastMessage(const NetworkMessage& message);
    
    // Callbacks
    void onConnected(std::function<void()> callback);
    void onDisconnected(std::function<void()> callback);
    void onMessageReceived(std::function<void(const NetworkMessage&)> callback);
    
    // Statistics
    int getPing() const;
    float getUploadSpeed() const;
    float getDownloadSpeed() const;
    int getPacketLoss() const;
    
    // Update
    void update();
    
private:
    NetworkManager();
    ~NetworkManager();
    
    NetworkPeer* _serverConnection;
    NetworkServer* _server;
    bool _isServer;
};

} // namespace WolfManAlpha

#endif // WOLFMAN_NETWORK_H
