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
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  batchGroupNodes,
  getNodesInGroup,
} from '../../app/utils/batch-operations';
import { nanoid } from '../../app/utils/id-generator';

interface Group {
  id: string;
  name: string;
  color: string;
  nodeCount: number;
  createdAt: number;
}

const groupColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
];

export default function NodeGrouping() {
  const [visible, setVisible] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState(groupColors[0]);
  const { nodes, setNodes, selectedNodeId } = useEditorStore();

  useEffect(() => {
    // Extract groups from nodes
    const groupMap = new Map<string, Group>();
    nodes.forEach((node) => {
      const groupId = node.data?.groupId;
      if (groupId) {
        if (!groupMap.has(groupId)) {
          groupMap.set(groupId, {
            id: groupId,
            name: `Group ${groupMap.size + 1}`,
            color: groupColors[groupMap.size % groupColors.length],
            nodeCount: 0,
            createdAt: Date.now(),
          });
        }
        const group = groupMap.get(groupId)!;
        group.nodeCount++;
      }
    });
    setGroups(Array.from(groupMap.values()));
  }, [nodes]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }

    if (!selectedNodeId) {
      Alert.alert('Error', 'Please select a node first');
      return;
    }

    const groupId = nanoid();
    const newGroup: Group = {
      id: groupId,
      name: newGroupName,
      color: selectedColor,
      nodeCount: 1,
      createdAt: Date.now(),
    };

    // Add selected node to group
    const updated = batchGroupNodes(nodes, [selectedNodeId], groupId);
    setNodes(updated);
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    Alert.alert('Success', `Group "${newGroupName}" created`);
  };

  const handleAddNodeToGroup = (groupId: string) => {
    if (!selectedNodeId) {
      Alert.alert('Error', 'Please select a node first');
      return;
    }

    const updated = batchGroupNodes(nodes, [selectedNodeId], groupId);
    setNodes(updated);
    Alert.alert('Success', 'Node added to group');
  };

  const handleRemoveGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    Alert.alert('Delete Group', `Remove "${group?.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Remove group from all nodes
          const updated = nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              groupId:
                node.data?.groupId === groupId
                  ? undefined
                  : node.data?.groupId,
            },
          }));
          setNodes(updated);
          setGroups(groups.filter((g) => g.id !== groupId));
          Alert.alert('Success', 'Group deleted');
        },
      },
    ]);
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name="folder-multiple"
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>Groups</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Node Groups</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Create Group */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Create New Group</Text>

              <TextInput
                style={styles.input}
                placeholder="Group name"
                placeholderTextColor="#64748b"
                value={newGroupName}
                onChangeText={setNewGroupName}
              />

              <Text style={styles.colorLabel}>Color</Text>
              <View style={styles.colorGrid}>
                {groupColors.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: color,
                        borderWidth: selectedColor === color ? 3 : 1,
                        borderColor:
                          selectedColor === color ? '#ffffff' : color,
                      },
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>

              <Pressable
                style={[
                  styles.createButton,
                  !selectedNodeId && styles.createButtonDisabled,
                ]}
                onPress={handleCreateGroup}
                disabled={!selectedNodeId}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.createButtonText}>
                  {selectedNodeId
                    ? 'Create & Add Selected'
                    : 'Select a Node First'}
                </Text>
              </Pressable>
            </View>

            {/* Existing Groups */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Groups ({groups.length})
              </Text>

              {groups.length > 0 ? (
                <FlatList
                  data={groups}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.groupCard}>
                      <View style={styles.groupHeader}>
                        <View
                          style={[
                            styles.groupColor,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <View style={styles.groupInfo}>
                          <Text style={styles.groupName}>{item.name}</Text>
                          <Text style={styles.groupMeta}>
                            {item.nodeCount} node(s)
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => handleRemoveGroup(item.id)}
                          style={styles.deleteButton}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={18}
                            color="#ef4444"
                          />
                        </Pressable>
                      </View>

                      <Pressable
                        style={styles.addNodeButton}
                        onPress={() => handleAddNodeToGroup(item.id)}
                        disabled={!selectedNodeId}
                      >
                        <MaterialCommunityIcons
                          name="plus-circle"
                          size={16}
                          color={selectedNodeId ? item.color : '#64748b'}
                        />
                        <Text
                          style={[
                            styles.addNodeButtonText,
                            !selectedNodeId && { color: '#64748b' },
                          ]}
                        >
                          {selectedNodeId
                            ? 'Add Selected to Group'
                            : 'Select a Node'}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="folder-multiple-outline"
                    size={48}
                    color="#64748b"
                  />
                  <Text style={styles.emptyText}>No groups yet</Text>
                  <Text style={styles.emptySubtext}>
                    Create your first group above
                  </Text>
                </View>
              )}
            </View>

            {/* Usage Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips</Text>
              <View style={styles.tip}>
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={16}
                  color="#f59e0b"
                />
                <Text style={styles.tipText}>
                  Groups help organize and visually categorize nodes on canvas
                </Text>
              </View>
              <View style={styles.tip}>
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={16}
                  color="#f59e0b"
                />
                <Text style={styles.tipText}>
                  Select a node, then add it to existing groups quickly
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
  colorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  colorOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  groupCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 11,
    color: '#94a3b8',
  },
  deleteButton: {
    padding: 6,
  },
  addNodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  addNodeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
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
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
  },
});
