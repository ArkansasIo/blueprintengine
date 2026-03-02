import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  FlatList,
  TextInput,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CollaborativeUser,
  initializeCollaborationState,
  addUser,
  removeUser,
} from '../../app/utils/collaboration-sync';

export default function CollaborationPanel() {
  const [visible, setVisible] = useState(false);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [inviteLink, setInviteLink] = useState('');
  const [userName, setUserName] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const handleEnableCollaboration = () => {
    if (!collaborationEnabled) {
      const link = `https://steercode.dev/blueprint/${Math.random().toString(36).substr(2, 9)}`;
      setInviteLink(link);
      setCollaborationEnabled(true);
      Alert.alert('Collaboration Enabled', 'Share the link to invite others');
    } else {
      setCollaborationEnabled(false);
      setUsers([]);
      setInviteLink('');
    }
  };

  const handleAddUser = () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Enter your name');
      return;
    }

    const newUser: CollaborativeUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: userName,
      color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][users.length % 5],
      lastActive: Date.now(),
    };

    setUsers([...users, newUser]);
    setUserName('');
    Alert.alert('Success', `${newUser.name} joined`);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleCopyInviteLink = () => {
    console.log('Copied:', inviteLink);
    Alert.alert('Copied', 'Invite link copied to clipboard');
  };

  const getStatusColor = (lastActive: number) => {
    const diff = Date.now() - lastActive;
    if (diff < 5000) return '#10b981'; // Active
    if (diff < 30000) return '#f59e0b'; // Idle
    return '#64748b'; // Away
  };

  const getStatusText = (lastActive: number) => {
    const diff = Date.now() - lastActive;
    if (diff < 5000) return 'Active';
    if (diff < 30000) return 'Idle';
    return 'Away';
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name={collaborationEnabled ? 'account-multiple' : 'account-multiple-outline'}
          size={20}
          color={collaborationEnabled ? '#10b981' : '#fff'}
        />
        <Text style={styles.buttonText}>Collab</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Collaboration</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Enable Collaboration */}
            <View style={styles.section}>
              <View style={styles.enableRow}>
                <View style={styles.enableInfo}>
                  <Text style={styles.enableTitle}>Enable Real-time Collaboration</Text>
                  <Text style={styles.enableDesc}>
                    Allow multiple users to edit simultaneously
                  </Text>
                </View>
                <Switch
                  value={collaborationEnabled}
                  onValueChange={handleEnableCollaboration}
                />
              </View>
            </View>

            {collaborationEnabled && (
              <>
                {/* Invite Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Invite Others</Text>

                  <View style={styles.inviteBox}>
                    <TextInput
                      style={styles.inviteInput}
                      value={inviteLink}
                      editable={false}
                      placeholderTextColor="#64748b"
                    />
                    <Pressable
                      style={styles.copyButton}
                      onPress={handleCopyInviteLink}
                    >
                      <MaterialCommunityIcons
                        name="content-copy"
                        size={18}
                        color="#06b6d4"
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.linkDesc}>
                    Share this link with others to collaborate
                  </Text>
                </View>

                {/* Active Users */}
                <View style={styles.section}>
                  <View style={styles.usersHeader}>
                    <Text style={styles.sectionTitle}>
                      Active Users ({users.length + 1})
                    </Text>
                    <View style={styles.statusIndicator}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: '#10b981' },
                        ]}
                      />
                      <Text style={styles.statusLabel}>Connected</Text>
                    </View>
                  </View>

                  {/* Current User */}
                  <View style={styles.userCard}>
                    <View
                      style={[
                        styles.userAvatar,
                        { backgroundColor: '#8b5cf6' },
                      ]}
                    >
                      <Text style={styles.avatarText}>Me</Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>You</Text>
                      <Text style={styles.userStatus}>
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: '#10b981' },
                          ]}
                        />
                        Active
                      </Text>
                    </View>
                  </View>

                  {/* Other Users */}
                  {users.length > 0 ? (
                    <FlatList
                      data={users}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View style={styles.userCard}>
                          <View
                            style={[
                              styles.userAvatar,
                              { backgroundColor: item.color },
                            ]}
                          >
                            <Text style={styles.avatarText}>
                              {item.name[0].toUpperCase()}
                            </Text>
                          </View>
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userStatus}>
                              <View
                                style={[
                                  styles.statusDot,
                                  { backgroundColor: getStatusColor(item.lastActive) },
                                ]}
                              />
                              {getStatusText(item.lastActive)}
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => handleRemoveUser(item.id)}
                            style={styles.removeButton}
                          >
                            <MaterialCommunityIcons
                              name="close-circle-outline"
                              size={20}
                              color="#ef4444"
                            />
                          </Pressable>
                        </View>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  ) : (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No other users yet</Text>
                    </View>
                  )}
                </View>

                {/* Add Test User */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Test Users (Demo)</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter name"
                    placeholderTextColor="#64748b"
                    value={userName}
                    onChangeText={setUserName}
                  />

                  <Pressable
                    style={styles.addUserButton}
                    onPress={handleAddUser}
                  >
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.addUserButtonText}>Add Test User</Text>
                  </Pressable>
                </View>

                {/* Collaboration Features */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Features</Text>

                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.featureText}>
                        Real-time node sync
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.featureText}>
                        Live cursor tracking
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.featureText}>
                        Conflict resolution
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={16}
                        color="#10b981"
                      />
                      <Text style={styles.featureText}>
                        Activity log
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#64748b',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  modal: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  enableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  enableInfo: {
    flex: 1,
  },
  enableTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  enableDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  inviteBox: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginBottom: 8,
    gap: 8,
  },
  inviteInput: {
    flex: 1,
    color: '#cbd5e1',
    paddingVertical: 10,
    fontSize: 12,
  },
  copyButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  linkDesc: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  usersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 11,
    color: '#94a3b8',
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
    marginBottom: 12,
    fontSize: 14,
  },
  addUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06b6d4',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  addUserButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    gap: 10,
  },
  featureText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});
