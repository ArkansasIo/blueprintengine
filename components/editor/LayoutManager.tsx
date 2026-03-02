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
import { applyLayout, LayoutType } from '../../app/utils/layout-algorithms';

interface LayoutOption {
  id: LayoutType;
  label: string;
  icon: string;
  description: string;
}

const layoutOptions: LayoutOption[] = [
  {
    id: 'hierarchical',
    label: 'Hierarchical',
    icon: 'call-split',
    description: 'Layer nodes by hierarchy/dependency',
  },
  {
    id: 'circular',
    label: 'Circular',
    icon: 'circle-outline',
    description: 'Arrange nodes in a circle',
  },
  {
    id: 'grid',
    label: 'Grid',
    icon: 'table',
    description: 'Arrange nodes in a grid pattern',
  },
  {
    id: 'force-directed',
    label: 'Force-Directed',
    icon: 'force-directed',
    description: 'Physics-based layout simulation',
  },
  {
    id: 'tree',
    label: 'Tree',
    icon: 'file-tree',
    description: 'Tree structure layout',
  },
];

export default function LayoutManager() {
  const [visible, setVisible] = useState(false);
  const [spacing, setSpacing] = useState(100);
  const { nodes, edges, setNodes } = useEditorStore();

  const handleApplyLayout = (layoutType: LayoutType) => {
    if (nodes.length === 0) {
      Alert.alert('Error', 'No nodes to layout');
      return;
    }

    try {
      const layouted = applyLayout(nodes, edges, layoutType, {
        spacing,
        nodeWidth: 160,
        nodeHeight: 100,
      });
      setNodes(layouted);
      Alert.alert('Success', `Applied ${layoutType} layout`);
    } catch (error) {
      Alert.alert('Error', 'Failed to apply layout');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name="call-split"
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>Layout</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Layout Manager</Text>
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
                Choose a layout algorithm to automatically organize your nodes
              </Text>
            </View>

            {/* Spacing Control */}
            <View style={styles.section}>
              <View style={styles.spacingHeader}>
                <Text style={styles.sectionTitle}>Node Spacing</Text>
                <Text style={styles.spacingValue}>{spacing}px</Text>
              </View>

              {/* Custom Slider using buttons */}
              <View style={styles.spacingControl}>
                <Pressable
                  style={styles.spacingButton}
                  onPress={() => setSpacing(Math.max(50, spacing - 10))}
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={16}
                    color="#06b6d4"
                  />
                </Pressable>

                <TextInput
                  style={styles.spacingInput}
                  value={String(spacing)}
                  onChangeText={(val) => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) {
                      setSpacing(Math.max(50, Math.min(250, num)));
                    }
                  }}
                  keyboardType="number-pad"
                />

                <Pressable
                  style={styles.spacingButton}
                  onPress={() => setSpacing(Math.min(250, spacing + 10))}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={16}
                    color="#06b6d4"
                  />
                </Pressable>
              </View>

              <Text style={styles.spacingDesc}>
                Adjust spacing between nodes (50-250px)
              </Text>
            </View>

            {/* Layout Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Layouts</Text>
              {layoutOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.layoutCard}
                  onPress={() => handleApplyLayout(option.id)}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={24}
                    color="#06b6d4"
                  />
                  <View style={styles.layoutInfo}>
                    <Text style={styles.layoutLabel}>{option.label}</Text>
                    <Text style={styles.layoutDesc}>{option.description}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#64748b"
                  />
                </Pressable>
              ))}
            </View>

            {/* Preview Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Graph</Text>
              <View style={styles.graphInfo}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="cube-outline"
                    size={16}
                    color="#3b82f6"
                  />
                  <Text style={styles.infoLabel}>Nodes</Text>
                  <Text style={styles.infoValue}>{nodes.length}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="vector-link"
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.infoLabel}>Edges</Text>
                  <Text style={styles.infoValue}>{edges.length}</Text>
                </View>
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
  spacingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spacingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#06b6d4',
  },
  spacingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  spacingButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacingInput: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  spacingDesc: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  layoutCard: {
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
  layoutInfo: {
    flex: 1,
  },
  layoutLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  layoutDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  graphInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 4,
  },
});