import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { alignNodes, AlignmentType } from '../../app/utils/node-alignment';

interface AlignmentOption {
  id: AlignmentType;
  label: string;
  icon: string;
  description: string;
}

const alignmentOptions: AlignmentOption[] = [
  { id: 'left', label: 'Left', icon: 'align-horizontal-left', description: 'Align to left' },
  { id: 'center-h', label: 'Center H', icon: 'align-horizontal-center', description: 'Align horizontally' },
  { id: 'right', label: 'Right', icon: 'align-horizontal-right', description: 'Align to right' },
  { id: 'distribute-h', label: 'Distribute H', icon: 'distribute-horizontal-center', description: 'Distribute horizontally' },
  { id: 'top', label: 'Top', icon: 'align-vertical-top', description: 'Align to top' },
  { id: 'center-v', label: 'Center V', icon: 'align-vertical-center', description: 'Align vertically' },
  { id: 'bottom', label: 'Bottom', icon: 'align-vertical-bottom', description: 'Align to bottom' },
  { id: 'distribute-v', label: 'Distribute V', icon: 'distribute-vertical-center', description: 'Distribute vertically' },
];

export default function AlignmentTools() {
  const [visible, setVisible] = useState(false);
  const { nodes, setNodes, selectedNodeId } = useEditorStore();
  
  // Get all selected nodes (simplified - tracks primary selection)
  const selectedNodes = selectedNodeId ? nodes.filter((n) => n.id === selectedNodeId) : [];

  const handleAlign = (type: AlignmentType) => {
    if (selectedNodes.length < 2) {
      Alert.alert('Info', 'Select at least 2 nodes to align');
      return;
    }

    try {
      const selectedIds = selectedNodes.map((n) => n.id);
      const aligned = alignNodes(nodes, selectedIds, type);
      setNodes(aligned);
      Alert.alert('Success', `Nodes aligned: ${type}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to align nodes');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="align-horizontal-left" size={20} color="#fff" />
        <Text style={styles.buttonText}>Align</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Alignment Tools</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.info}>
              Select multiple nodes to align or distribute them on the canvas.
            </Text>

            {/* Horizontal Alignment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Horizontal</Text>
              <View style={styles.buttonGrid}>
                {['left', 'center-h', 'right', 'distribute-h'].map((type) => {
                  const option = alignmentOptions.find((o) => o.id === type) as AlignmentOption;
                  return (
                    <Pressable
                      key={type}
                      style={styles.gridButton}
                      onPress={() => handleAlign(type as AlignmentType)}
                    >
                      <MaterialCommunityIcons
                        name={option.icon as any}
                        size={24}
                        color="#06b6d4"
                      />
                      <Text style={styles.gridButtonLabel}>{option.label}</Text>
                      <Text style={styles.gridButtonDesc}>{option.description}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Vertical Alignment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vertical</Text>
              <View style={styles.buttonGrid}>
                {['top', 'center-v', 'bottom', 'distribute-v'].map((type) => {
                  const option = alignmentOptions.find((o) => o.id === type) as AlignmentOption;
                  return (
                    <Pressable
                      key={type}
                      style={styles.gridButton}
                      onPress={() => handleAlign(type as AlignmentType)}
                    >
                      <MaterialCommunityIcons
                        name={option.icon as any}
                        size={24}
                        color="#10b981"
                      />
                      <Text style={styles.gridButtonLabel}>{option.label}</Text>
                      <Text style={styles.gridButtonDesc}>{option.description}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color="#f59e0b"
              />
              <Text style={styles.infoText}>
                Currently supporting primary selection. Multi-select coming soon.
              </Text>
            </View>
          </View>
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
  info: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
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
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  gridButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
    marginTop: 8,
  },
  gridButtonDesc: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
  },
});
