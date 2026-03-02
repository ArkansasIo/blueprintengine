import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, TextInput, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Commit {
  id: string;
  timestamp: Date;
  message: string;
  author: string;
  changes: Change[];
  nodeCount: number;
  edgeCount: number;
}

interface Change {
  type: 'added' | 'modified' | 'deleted';
  nodeId?: string;
  nodeName: string;
  details: string;
}

export default function VersionControlPanel() {
  const [visible, setVisible] = useState(false);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [commitAuthor, setCommitAuthor] = useState('User');
  const [activeTab, setActiveTab] = useState<'history' | 'changes' | 'diff'>('history');

  const handleCreateCommit = () => {
    if (!commitMessage.trim()) {
      Alert.alert('Error', 'Please enter a commit message');
      return;
    }

    const newCommit: Commit = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message: commitMessage,
      author: commitAuthor,
      changes: [], // Would be populated with actual changes
      nodeCount: 0,
      edgeCount: 0,
    };

    setCommits([newCommit, ...commits]);
    setSelectedCommit(newCommit);
    setCommitMessage('');
    setShowCommitDialog(false);

    Alert.alert('Success', 'Commit created successfully');
  };

  const handleRollback = (commit: Commit) => {
    Alert.alert(
      'Rollback to Commit',
      `Rollback to commit "${commit.message}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Rollback',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Blueprint rolled back to this commit');
          },
        },
      ]
    );
  };

  const getChangeColor = (changeType: Change['type']) => {
    switch (changeType) {
      case 'added':
        return '#10b981';
      case 'modified':
        return '#3b82f6';
      case 'deleted':
        return '#ef4444';
      default:
        return '#cbd5e1';
    }
  };

  const getChangeIcon = (changeType: Change['type']) => {
    switch (changeType) {
      case 'added':
        return 'plus-circle';
      case 'modified':
        return 'pencil-circle';
      case 'deleted':
        return 'minus-circle';
      default:
        return 'circle';
    }
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="git" size={18} color="#fff" />
        <Text style={styles.buttonText}>Version Control</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Blueprint Version Control</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <Pressable
              style={styles.commitButton}
              onPress={() => setShowCommitDialog(true)}
            >
              <MaterialCommunityIcons name="check-all" size={16} color="#fff" />
              <Text style={styles.commitButtonText}>Create Commit</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {(['history', 'changes', 'diff'] as const).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Content */}
          {activeTab === 'history' && (
            <ScrollView style={styles.content}>
              {commits.length > 0 ? (
                commits.map((commit) => (
                  <Pressable
                    key={commit.id}
                    style={[
                      styles.commitItem,
                      selectedCommit?.id === commit.id && styles.commitItemActive,
                    ]}
                    onPress={() => setSelectedCommit(commit)}
                  >
                    <View style={styles.commitItemLeft}>
                      <View style={styles.commitHash}>
                        <Text style={styles.commitHashText}>{commit.id.slice(0, 7)}</Text>
                      </View>
                      <View style={styles.commitInfo}>
                        <Text style={styles.commitMessage}>{commit.message}</Text>
                        <Text style={styles.commitMeta}>
                          {commit.author} • {commit.timestamp.toLocaleString()}
                        </Text>
                        <Text style={styles.commitStats}>
                          {commit.nodeCount} nodes • {commit.edgeCount} edges
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      style={styles.rollbackButton}
                      onPress={() => handleRollback(commit)}
                    >
                      <MaterialCommunityIcons name="backup-restore" size={16} color="#f59e0b" />
                    </Pressable>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="git" size={48} color="#64748b" />
                  <Text style={styles.emptyText}>No commits yet</Text>
                  <Text style={styles.emptySubtext}>Create your first commit to start tracking changes</Text>
                </View>
              )}
            </ScrollView>
          )}

          {activeTab === 'changes' && selectedCommit && (
            <ScrollView style={styles.content}>
              {selectedCommit.changes.length > 0 ? (
                selectedCommit.changes.map((change, idx) => (
                  <View key={idx} style={styles.changeItem}>
                    <View style={styles.changeHeader}>
                      <MaterialCommunityIcons
                        name={getChangeIcon(change.type) as any}
                        size={16}
                        color={getChangeColor(change.type)}
                      />
                      <Text style={styles.changeName}>{change.nodeName}</Text>
                      <View
                        style={[
                          styles.changeBadge,
                          { backgroundColor: getChangeColor(change.type) },
                        ]}
                      >
                        <Text style={styles.changeBadgeText}>{change.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.changeDetails}>{change.details}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="close-circle-outline" size={48} color="#64748b" />
                  <Text style={styles.emptyText}>No changes in this commit</Text>
                </View>
              )}
            </ScrollView>
          )}

          {activeTab === 'diff' && selectedCommit && (
            <ScrollView style={styles.content}>
              <View style={styles.diffBox}>
                <View style={styles.diffSection}>
                  <Text style={styles.diffTitle}>Nodes Added</Text>
                  {selectedCommit.changes
                    .filter((c) => c.type === 'added')
                    .map((change, idx) => (
                      <View key={idx} style={[styles.diffLine, styles.diffLineAdded]}>
                        <Text style={styles.diffLineText}>+ {change.nodeName}</Text>
                      </View>
                    ))}
                </View>

                <View style={styles.diffSection}>
                  <Text style={styles.diffTitle}>Nodes Modified</Text>
                  {selectedCommit.changes
                    .filter((c) => c.type === 'modified')
                    .map((change, idx) => (
                      <View key={idx} style={[styles.diffLine, styles.diffLineModified]}>
                        <Text style={styles.diffLineText}>~ {change.nodeName}</Text>
                      </View>
                    ))}
                </View>

                <View style={styles.diffSection}>
                  <Text style={styles.diffTitle}>Nodes Deleted</Text>
                  {selectedCommit.changes
                    .filter((c) => c.type === 'deleted')
                    .map((change, idx) => (
                      <View key={idx} style={[styles.diffLine, styles.diffLineDeleted]}>
                        <Text style={styles.diffLineText}>- {change.nodeName}</Text>
                      </View>
                    ))}
                </View>
              </View>
            </ScrollView>
          )}
        </View>

        {/* Commit Dialog */}
        <Modal visible={showCommitDialog} transparent animationType="fade">
          <View style={styles.dialogBackdrop}>
            <View style={styles.dialog}>
              <Text style={styles.dialogTitle}>Create Commit</Text>

              <Text style={styles.dialogLabel}>Message</Text>
              <TextInput
                style={styles.dialogInput}
                placeholder="Describe your changes..."
                placeholderTextColor="#64748b"
                value={commitMessage}
                onChangeText={setCommitMessage}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.dialogLabel}>Author</Text>
              <TextInput
                style={[styles.dialogInput, { minHeight: 40 }]}
                placeholder="Your name"
                placeholderTextColor="#64748b"
                value={commitAuthor}
                onChangeText={setCommitAuthor}
              />

              <View style={styles.dialogButtons}>
                <Pressable
                  style={[styles.dialogButton, styles.dialogButtonCancel]}
                  onPress={() => {
                    setShowCommitDialog(false);
                    setCommitMessage('');
                  }}
                >
                  <Text style={styles.dialogButtonCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.dialogButton, styles.dialogButtonCreate]}
                  onPress={handleCreateCommit}
                >
                  <Text style={styles.dialogButtonCreateText}>Create Commit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
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
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  commitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  commitButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#06b6d4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#06b6d4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  commitItemActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  commitItemLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  commitHash: {
    backgroundColor: '#0f172a',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  commitHashText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#06b6d4',
    fontFamily: 'monospace',
  },
  commitInfo: {
    flex: 1,
  },
  commitMessage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  commitMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
  },
  commitStats: {
    fontSize: 10,
    color: '#64748b',
  },
  rollbackButton: {
    padding: 8,
  },
  changeItem: {
    backgroundColor: '#1e293b',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#334155',
  },
  changeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  changeName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  changeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  changeDetails: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  diffBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  diffSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  diffTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  diffLine: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  diffLineAdded: {
    backgroundColor: '#064e3b',
  },
  diffLineModified: {
    backgroundColor: '#0c4a6e',
  },
  diffLineDeleted: {
    backgroundColor: '#7f1d1d',
  },
  diffLineText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#e2e8f0',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minWidth: 300,
    maxWidth: 500,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  dialogLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  dialogInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#e2e8f0',
    fontSize: 12,
    marginBottom: 12,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  dialogButtonCancel: {
    backgroundColor: '#334155',
  },
  dialogButtonCancelText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  dialogButtonCreate: {
    backgroundColor: '#10b981',
  },
  dialogButtonCreateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
