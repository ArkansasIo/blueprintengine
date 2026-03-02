import React, { useState } from 'react';
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
  BlueprintVersion,
  calculateDiff,
} from '../../app/utils/blueprint-versioning';

interface DiffChange {
  type: 'added' | 'removed' | 'modified';
  nodeId: string;
  nodeName: string;
  details: string;
}

export default function DiffViewer() {
  const [visible, setVisible] = useState(false);
  const [versions, setVersions] = useState<BlueprintVersion[]>([]);
  const [selectedVersion1, setSelectedVersion1] = useState<string | null>(null);
  const [selectedVersion2, setSelectedVersion2] = useState<string | null>(null);
  const [diffs, setDiffs] = useState<DiffChange[]>([]);
  const [blueprintId] = useState('default');

  const { nodes } = useEditorStore();

  const loadVersions = async () => {
    try {
      const list = await getVersions(blueprintId);
      setVersions(list.reverse());
    } catch (error) {
      Alert.alert('Error', 'Failed to load versions');
    }
  };

  const handleCompareDiff = () => {
    if (!selectedVersion1 || !selectedVersion2) {
      Alert.alert('Error', 'Select two versions to compare');
      return;
    }

    const v1 = versions.find((v) => v.id === selectedVersion1);
    const v2 = versions.find((v) => v.id === selectedVersion2);

    if (!v1 || !v2) return;

    const diff = calculateDiff(v1.nodes, v2.nodes);
    const changes: DiffChange[] = [];

    // Added nodes
    for (let i = 0; i < diff.added; i++) {
      changes.push({
        type: 'added',
        nodeId: `added_${i}`,
        nodeName: 'New Node',
        details: `Added ${diff.added} node(s)`,
      });
    }

    // Removed nodes
    for (let i = 0; i < diff.removed; i++) {
      changes.push({
        type: 'removed',
        nodeId: `removed_${i}`,
        nodeName: 'Deleted Node',
        details: `Removed ${diff.removed} node(s)`,
      });
    }

    // Modified nodes
    for (let i = 0; i < diff.modified; i++) {
      changes.push({
        type: 'modified',
        nodeId: `modified_${i}`,
        nodeName: 'Updated Node',
        details: `Modified ${diff.modified} node(s)`,
      });
    }

    setDiffs(changes);
  };

  const getChangeColor = (type: DiffChange['type']) => {
    switch (type) {
      case 'added':
        return '#10b981';
      case 'removed':
        return '#ef4444';
      case 'modified':
        return '#f59e0b';
    }
  };

  const getChangeIcon = (type: DiffChange['type']) => {
    switch (type) {
      case 'added':
        return 'plus-circle';
      case 'removed':
        return 'minus-circle';
      case 'modified':
        return 'pencil-circle';
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => {
          loadVersions();
          setVisible(true);
        }}
      >
        <MaterialCommunityIcons name="compare" size={20} color="#fff" />
        <Text style={styles.buttonText}>Diff</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Diff Viewer</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Version Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compare Versions</Text>

              <View style={styles.versionSelector}>
                <View style={styles.versionColumn}>
                  <Text style={styles.columnLabel}>From Version</Text>
                  <ScrollView style={styles.versionList}>
                    {versions.map((v) => (
                      <Pressable
                        key={`v1_${v.id}`}
                        style={[
                          styles.versionItem,
                          selectedVersion1 === v.id &&
                            styles.versionItemSelected,
                        ]}
                        onPress={() => setSelectedVersion1(v.id)}
                      >
                        <Text style={styles.versionItemLabel}>
                          v{v.version}
                        </Text>
                        <Text style={styles.versionItemDesc}>
                          {v.message}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.arrowContainer}>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={24}
                    color="#06b6d4"
                  />
                </View>

                <View style={styles.versionColumn}>
                  <Text style={styles.columnLabel}>To Version</Text>
                  <ScrollView style={styles.versionList}>
                    {versions.map((v) => (
                      <Pressable
                        key={`v2_${v.id}`}
                        style={[
                          styles.versionItem,
                          selectedVersion2 === v.id &&
                            styles.versionItemSelected,
                        ]}
                        onPress={() => setSelectedVersion2(v.id)}
                      >
                        <Text style={styles.versionItemLabel}>
                          v{v.version}
                        </Text>
                        <Text style={styles.versionItemDesc}>
                          {v.message}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <Pressable
                style={[
                  styles.compareButton,
                  (!selectedVersion1 || !selectedVersion2) &&
                    styles.compareButtonDisabled,
                ]}
                onPress={handleCompareDiff}
                disabled={!selectedVersion1 || !selectedVersion2}
              >
                <MaterialCommunityIcons
                  name="compare"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.compareButtonText}>Compare</Text>
              </Pressable>
            </View>

            {/* Diff Results */}
            {diffs.length > 0 && (
              <View style={styles.section}>
                <View style={styles.diffHeader}>
                  <Text style={styles.sectionTitle}>Changes</Text>
                  <Text style={styles.diffCount}>{diffs.length}</Text>
                </View>

                <FlatList
                  data={diffs}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        styles.diffItem,
                        {
                          borderLeftColor: getChangeColor(item.type),
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={getChangeIcon(item.type) as any}
                        size={20}
                        color={getChangeColor(item.type)}
                      />
                      <View style={styles.diffInfo}>
                        <Text style={styles.diffNodeName}>
                          {item.nodeName}
                        </Text>
                        <Text style={styles.diffDetails}>
                          {item.details}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.diffBadge,
                          {
                            backgroundColor: getChangeColor(item.type),
                          },
                        ]}
                      >
                        {item.type.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.nodeId}
                />
              </View>
            )}

            {/* Empty State */}
            {versions.length === 0 && (
              <View style={styles.empty}>
                <MaterialCommunityIcons
                  name="compare"
                  size={48}
                  color="#64748b"
                />
                <Text style={styles.emptyText}>No versions available</Text>
                <Text style={styles.emptySubtext}>
                  Save versions first to compare
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
  versionSelector: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 16,
    gap: 8,
  },
  versionColumn: {
    flex: 1,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  versionList: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  versionItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  versionItemSelected: {
    backgroundColor: '#0c4a6e',
    borderLeftWidth: 3,
    borderLeftColor: '#06b6d4',
  },
  versionItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  versionItemDesc: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  compareButtonDisabled: {
    opacity: 0.5,
  },
  compareButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  diffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diffCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06b6d4',
    backgroundColor: '#0c4a6e',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  diffItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 8,
    gap: 12,
  },
  diffInfo: {
    flex: 1,
  },
  diffNodeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  diffDetails: {
    fontSize: 11,
    color: '#94a3b8',
  },
  diffBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '600',
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
