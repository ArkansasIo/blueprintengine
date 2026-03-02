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

interface ConnectionPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  pattern: 'chain' | 'star' | 'tree' | 'mesh' | 'bipartite';
}

const patterns: ConnectionPattern[] = [
  {
    id: 'chain',
    name: 'Chain',
    description: 'Linear connection: A → B → C → D',
    icon: 'arrow-right',
    pattern: 'chain',
  },
  {
    id: 'star',
    name: 'Star',
    description: 'Center hub connecting to all nodes',
    icon: 'star-outline',
    pattern: 'star',
  },
  {
    id: 'tree',
    name: 'Tree',
    description: 'Hierarchical parent-child structure',
    icon: 'file-tree',
    pattern: 'tree',
  },
  {
    id: 'mesh',
    name: 'Mesh',
    description: 'Fully connected network',
    icon: 'network',
    pattern: 'mesh',
  },
  {
    id: 'bipartite',
    name: 'Bipartite',
    description: 'Two groups connecting across',
    icon: 'call-split',
    pattern: 'bipartite',
  },
];

export default function ConnectionPresets() {
  const [visible, setVisible] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const { nodes, edges, addEdge } = useEditorStore();

  const getSelectedNodes = () => nodes.filter((n) => n.id);

  const applyPattern = (pattern: ConnectionPattern['pattern']) => {
    const selectedNodes = getSelectedNodes();

    if (selectedNodes.length < 2) {
      Alert.alert('Error', 'Select at least 2 nodes');
      return;
    }

    try {
      const newEdges: any[] = [];

      switch (pattern) {
        case 'chain':
          for (let i = 0; i < selectedNodes.length - 1; i++) {
            newEdges.push({
              fromNodeId: selectedNodes[i].id,
              toNodeId: selectedNodes[i + 1].id,
            });
          }
          break;

        case 'star':
          const hub = selectedNodes[0];
          selectedNodes.slice(1).forEach((node) => {
            newEdges.push({
              fromNodeId: hub.id,
              toNodeId: node.id,
            });
          });
          break;

        case 'tree':
          for (let i = 0; i < Math.floor(selectedNodes.length / 2); i++) {
            const parent = selectedNodes[i];
            const child1 = selectedNodes[i * 2 + 1];
            const child2 = selectedNodes[i * 2 + 2];

            if (child1) {
              newEdges.push({
                fromNodeId: parent.id,
                toNodeId: child1.id,
              });
            }
            if (child2) {
              newEdges.push({
                fromNodeId: parent.id,
                toNodeId: child2.id,
              });
            }
          }
          break;

        case 'mesh':
          for (let i = 0; i < selectedNodes.length; i++) {
            for (let j = i + 1; j < selectedNodes.length; j++) {
              newEdges.push({
                fromNodeId: selectedNodes[i].id,
                toNodeId: selectedNodes[j].id,
              });
            }
          }
          break;

        case 'bipartite':
          const mid = Math.ceil(selectedNodes.length / 2);
          const group1 = selectedNodes.slice(0, mid);
          const group2 = selectedNodes.slice(mid);

          group1.forEach((node1) => {
            group2.forEach((node2) => {
              newEdges.push({
                fromNodeId: node1.id,
                toNodeId: node2.id,
              });
            });
          });
          break;
      }

      // Add all edges
      newEdges.forEach((edgeData) => {
        if (edgeData.fromNodeId && edgeData.toNodeId) {
          addEdge({
            id: Math.random().toString(36).substr(2, 9),
            ...edgeData,
            fromPinId: '',
            toPinId: '',
          });
        }
      });

      Alert.alert(
        'Success',
        `Applied ${pattern} pattern: ${newEdges.length} connections created`
      );
      setVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to apply pattern');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="link-variant" size={20} color="#fff" />
        <Text style={styles.buttonText}>Connect</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Connection Presets</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Info */}
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.infoText}>
                Quick connection patterns for selected nodes
              </Text>
            </View>

            {/* Pattern List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Patterns</Text>
              <FlatList
                data={patterns}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.patternCard}
                    onPress={() => {
                      setSelectedPattern(item.id);
                      applyPattern(item.pattern);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={24}
                      color="#06b6d4"
                    />
                    <View style={styles.patternInfo}>
                      <Text style={styles.patternName}>{item.name}</Text>
                      <Text style={styles.patternDesc}>
                        {item.description}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#64748b"
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>

            {/* Pattern Descriptions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pattern Guide</Text>

              <View style={styles.guideCard}>
                <View style={styles.guideBullet}>
                  <Text style={styles.guideTitle}>Chain</Text>
                  <Text style={styles.guideText}>
                    Connects nodes sequentially. Good for workflows.
                  </Text>
                </View>
              </View>

              <View style={styles.guideCard}>
                <View style={styles.guideBullet}>
                  <Text style={styles.guideTitle}>Star</Text>
                  <Text style={styles.guideText}>
                    First node connects to all others. Good for hubs.
                  </Text>
                </View>
              </View>

              <View style={styles.guideCard}>
                <View style={styles.guideBullet}>
                  <Text style={styles.guideTitle}>Tree</Text>
                  <Text style={styles.guideText}>
                    Hierarchical parent-child relationships.
                  </Text>
                </View>
              </View>

              <View style={styles.guideCard}>
                <View style={styles.guideBullet}>
                  <Text style={styles.guideTitle}>Mesh</Text>
                  <Text style={styles.guideText}>
                    Every node connects to every other node.
                  </Text>
                </View>
              </View>

              <View style={styles.guideCard}>
                <View style={styles.guideBullet}>
                  <Text style={styles.guideTitle}>Bipartite</Text>
                  <Text style={styles.guideText}>
                    Two groups with cross-connections.
                  </Text>
                </View>
              </View>
            </View>

            {/* Node Count */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Selection</Text>
              <View style={styles.countBox}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color="#f59e0b"
                />
                <Text style={styles.countText}>
                  {nodes.length} node(s) available
                </Text>
              </View>
            </View>
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
    marginBottom: 24,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
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
  patternCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
    gap: 12,
  },
  patternInfo: {
    flex: 1,
  },
  patternName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  patternDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  guideCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
  },
  guideBullet: {
    gap: 4,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  guideText: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 4,
  },
  countBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  countText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
});
