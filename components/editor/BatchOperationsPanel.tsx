import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  batchDeleteNodes,
  batchDuplicateNodes,
  batchUpdateNodeColor,
  batchLockNodes,
  batchHideNodes,
} from '../../app/utils/batch-operations';

const colors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#06b6d4', // cyan
];

export default function BatchOperationsPanel() {
  const [visible, setVisible] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const { nodes, setNodes } = useEditorStore();

  const handleToggleNodeSelection = (nodeId: string) => {
    const newSelection = new Set(selectedNodes);
    if (newSelection.has(nodeId)) {
      newSelection.delete(nodeId);
    } else {
      newSelection.add(nodeId);
    }
    setSelectedNodes(newSelection);
  };

  const handleSelectAll = () => {
    setSelectedNodes(new Set(nodes.map((n) => n.id)));
  };

  const handleDeselectAll = () => {
    setSelectedNodes(new Set());
  };

  const handleBatchDelete = () => {
    if (selectedNodes.size === 0) {
      Alert.alert('Error', 'Select at least one node');
      return;
    }

    Alert.alert(
      'Delete Nodes',
      `Remove ${selectedNodes.size} node(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = batchDeleteNodes(
              nodes,
              Array.from(selectedNodes)
            );
            setNodes(updated);
            setSelectedNodes(new Set());
            Alert.alert('Success', `${selectedNodes.size} node(s) deleted`);
          },
        },
      ]
    );
  };

  const handleBatchDuplicate = () => {
    if (selectedNodes.size === 0) {
      Alert.alert('Error', 'Select at least one node');
      return;
    }

    try {
      const updated = batchDuplicateNodes(
        nodes,
        Array.from(selectedNodes),
        80,
        80
      );
      setNodes(updated);
      Alert.alert('Success', `${selectedNodes.size} node(s) duplicated`);
    } catch (error) {
      Alert.alert('Error', 'Failed to duplicate nodes');
    }
  };

  const handleBatchColorChange = (color: string) => {
    if (selectedNodes.size === 0) {
      Alert.alert('Error', 'Select at least one node');
      return;
    }

    try {
      const updated = batchUpdateNodeColor(
        nodes,
        Array.from(selectedNodes),
        color
      );
      setNodes(updated);
      Alert.alert('Success', `Color updated for ${selectedNodes.size} node(s)`);
      setColorPickerVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update color');
    }
  };

  const handleBatchLock = () => {
    if (selectedNodes.size === 0) {
      Alert.alert('Error', 'Select at least one node');
      return;
    }

    try {
      const updated = batchLockNodes(nodes, Array.from(selectedNodes), true);
      setNodes(updated);
      Alert.alert('Success', `${selectedNodes.size} node(s) locked`);
    } catch (error) {
      Alert.alert('Error', 'Failed to lock nodes');
    }
  };

  const handleBatchUnlock = () => {
    if (selectedNodes.size === 0) {
      Alert.alert('Error', 'Select at least one node');
      return;
    }

    try {
      const updated = batchLockNodes(nodes, Array.from(selectedNodes), false);
      setNodes(updated);
      Alert.alert('Success', `${selectedNodes.size} node(s) unlocked`);
    } catch (error) {
      Alert.alert('Error', 'Failed to unlock nodes');
    }
  };

  const handleBatchHide = () => {
    if (selectedNodes.size === 0) {
      Alert.alert('Error', 'Select at least one node');
      return;
    }

    try {
      const updated = batchHideNodes(nodes, Array.from(selectedNodes), true);
      setNodes(updated);
      Alert.alert('Success', `${selectedNodes.size} node(s) hidden`);
    } catch (error) {
      Alert.alert('Error', 'Failed to hide nodes');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Batch</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Batch Operations</Text>
              <Text style={styles.subtitle}>
                Selected: {selectedNodes.size} / {nodes.length}
              </Text>
            </View>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Selection Controls */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selection</Text>
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.controlButton, styles.controlButtonPrimary]}
                  onPress={handleSelectAll}
                >
                  <MaterialCommunityIcons name="check-all" size={18} color="#06b6d4" />
                  <Text style={styles.controlButtonText}>Select All</Text>
                </Pressable>

                <Pressable
                  style={[styles.controlButton, styles.controlButtonSecondary]}
                  onPress={handleDeselectAll}
                >
                  <MaterialCommunityIcons name="close-circle-outline" size={18} color="#64748b" />
                  <Text style={styles.controlButtonText}>Deselect</Text>
                </Pressable>
              </View>
            </View>

            {/* Node List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nodes ({nodes.length})</Text>
              {nodes.map((node) => (
                <Pressable
                  key={node.id}
                  style={[
                    styles.nodeItem,
                    selectedNodes.has(node.id) && styles.nodeItemSelected,
                  ]}
                  onPress={() => handleToggleNodeSelection(node.id)}
                >
                  <View
                    style={[
                      styles.nodeCheckbox,
                      selectedNodes.has(node.id) && styles.nodeCheckboxChecked,
                    ]}
                  >
                    {selectedNodes.has(node.id) && (
                      <MaterialCommunityIcons name="check" size={14} color="#fff" />
                    )}
                  </View>
                  <View
                    style={[
                      styles.nodeColorIndicator,
                      { backgroundColor: node.color || '#8b5cf6' },
                    ]}
                  />
                  <View style={styles.nodeInfo}>
                    <Text style={styles.nodeLabel}>{node.label}</Text>
                    <Text style={styles.nodeType}>{node.type}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Batch Actions */}
            {selectedNodes.size > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Actions</Text>

                {/* Color Picker */}
                <View style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>Change Color</Text>
                  <View style={styles.colorGrid}>
                    {colors.map((color) => (
                      <Pressable
                        key={color}
                        style={[
                          styles.colorButton,
                          { backgroundColor: color },
                        ]}
                        onPress={() => handleBatchColorChange(color)}
                      />
                    ))}
                  </View>
                </View>

                {/* Lock/Unlock */}
                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.actionButton, styles.actionButtonSuccess]}
                    onPress={handleBatchLock}
                  >
                    <MaterialCommunityIcons name="lock" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Lock</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.actionButtonWarning]}
                    onPress={handleBatchUnlock}
                  >
                    <MaterialCommunityIcons name="lock-open" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Unlock</Text>
                  </Pressable>
                </View>

                {/* Hide */}
                <Pressable
                  style={[styles.actionButton, styles.actionButtonSecondary, styles.fullWidth]}
                  onPress={handleBatchHide}
                >
                  <MaterialCommunityIcons name="eye-off" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Hide Selected</Text>
                </Pressable>

                {/* Duplicate */}
                <Pressable
                  style={[styles.actionButton, styles.actionButtonInfo, styles.fullWidth]}
                  onPress={handleBatchDuplicate}
                >
                  <MaterialCommunityIcons name="content-copy" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>
                    Duplicate ({selectedNodes.size})
                  </Text>
                </Pressable>

                {/* Delete */}
                <Pressable
                  style={[styles.actionButton, styles.actionButtonDanger, styles.fullWidth]}
                  onPress={handleBatchDelete}
                >
                  <MaterialCommunityIcons name="trash-can" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>
                    Delete ({selectedNodes.size})
                  </Text>
                </Pressable>
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
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
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
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  controlButtonPrimary: {
    backgroundColor: '#0c4a6e',
    borderColor: '#06b6d4',
  },
  controlButtonSecondary: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  nodeItemSelected: {
    backgroundColor: '#0c4a6e',
    borderColor: '#06b6d4',
  },
  nodeCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#334155',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCheckboxChecked: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  nodeColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  nodeType: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
    marginBottom: 8,
  },
  actionButtonPrimary: {
    backgroundColor: '#3b82f6',
  },
  actionButtonSuccess: {
    backgroundColor: '#10b981',
  },
  actionButtonWarning: {
    backgroundColor: '#f59e0b',
  },
  actionButtonInfo: {
    backgroundColor: '#06b6d4',
  },
  actionButtonSecondary: {
    backgroundColor: '#64748b',
  },
  actionButtonDanger: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  fullWidth: {
    marginBottom: 8,
  },
});
