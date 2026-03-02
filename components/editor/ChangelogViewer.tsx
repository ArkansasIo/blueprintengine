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
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getVersions,
  restoreVersion,
  BlueprintVersion,
} from '../../app/utils/blueprint-versioning';

export default function ChangelogViewer() {
  const [visible, setVisible] = useState(false);
  const [versions, setVersions] = useState<BlueprintVersion[]>([]);
  const [blueprintId, setBlueprintId] = useState('default');
  const { setNodes, setEdges } = useEditorStore();

  useEffect(() => {
    if (visible) {
      loadVersions();
    }
  }, [visible]);

  const loadVersions = async () => {
    try {
      const versionList = await getVersions(blueprintId);
      setVersions(versionList.reverse());
    } catch (error) {
      Alert.alert('Error', 'Failed to load changelog');
    }
  };

  const handleRestoreVersion = async (version: BlueprintVersion) => {
    Alert.alert(
      'Restore Version',
      `Restore to version ${version.version}: "${version.message}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async () => {
            try {
              const restored = await restoreVersion(blueprintId, version.id);
              if (restored) {
                setNodes(restored.nodes);
                setEdges(restored.edges);
                Alert.alert(
                  'Success',
                  `Restored to version ${version.version}`
                );
                setVisible(false);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to restore version');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="history" size={20} color="#fff" />
        <Text style={styles.buttonText}>History</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Changelog</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {versions.length > 0 ? (
              <FlatList
                data={versions}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View style={styles.versionCard}>
                    <View style={styles.versionHeader}>
                      <View style={styles.versionBadge}>
                        <Text style={styles.versionNumber}>v{item.version}</Text>
                      </View>
                      <View style={styles.versionInfo}>
                        <Text style={styles.versionMessage}>{item.message}</Text>
                        <Text style={styles.versionTime}>
                          {formatDate(item.timestamp)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.versionStats}>
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons
                          name="cube-outline"
                          size={16}
                          color="#3b82f6"
                        />
                        <Text style={styles.statText}>
                          {item.nodes.length} nodes
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons
                          name="vector-link"
                          size={16}
                          color="#10b981"
                        />
                        <Text style={styles.statText}>
                          {item.edges.length} edges
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      style={styles.restoreButton}
                      onPress={() => handleRestoreVersion(item)}
                    >
                      <MaterialCommunityIcons
                        name="restore"
                        size={16}
                        color="#06b6d4"
                      />
                      <Text style={styles.restoreButtonText}>Restore</Text>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.empty}>
                <MaterialCommunityIcons
                  name="history"
                  size={48}
                  color="#64748b"
                />
                <Text style={styles.emptyText}>No versions yet</Text>
                <Text style={styles.emptySubtext}>
                  Save a version to start tracking changes
                </Text>
              </View>
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
  versionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  versionBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  versionNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  versionInfo: {
    flex: 1,
  },
  versionMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  versionTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  versionStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#0f172a',
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#0c4a6e',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#06b6d4',
    gap: 6,
  },
  restoreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#06b6d4',
  },
  empty: {
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
});
