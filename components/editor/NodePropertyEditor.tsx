import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NodePropertyEditor() {
  const [visible, setVisible] = useState(false);
  const { selectedNodeId, nodes, updateNode } = useEditorStore();
  const [editingData, setEditingData] = useState<Record<string, any>>({});

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const openEditor = () => {
    if (selectedNode?.data) {
      setEditingData({ ...selectedNode.data });
    }
    setVisible(true);
  };

  const saveChanges = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, { data: editingData });
      setVisible(false);
    }
  };

  const updateData = (key: string, value: any) => {
    setEditingData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <Pressable
        style={[
          styles.button,
          !selectedNode && styles.buttonDisabled,
        ]}
        onPress={openEditor}
        disabled={!selectedNode}
      >
        <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
        <Text style={styles.buttonText}>Props</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Edit: {selectedNode?.label}
            </Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {selectedNode?.data && Object.entries(selectedNode.data).length > 0 ? (
              Object.entries(selectedNode.data).map(([key, value]) => (
                <View key={key} style={styles.propertyGroup}>
                  <Text style={styles.propertyLabel}>{key}</Text>
                  <TextInput
                    style={styles.propertyInput}
                    value={String(editingData[key] || '')}
                    onChangeText={(text) => {
                      // Try to parse as number, otherwise keep as string
                      const parsed = isNaN(Number(text)) ? text : Number(text);
                      updateData(key, parsed);
                    }}
                    placeholderTextColor="#64748b"
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No properties to edit</Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.footer}>
            <Pressable
              style={[styles.footerButton, styles.cancelButton]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.footerButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.footerButton, styles.saveButton]}
              onPress={saveChanges}
            >
              <Text style={styles.footerButtonText}>Save</Text>
            </Pressable>
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
    borderColor: '#f59e0b',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonDisabled: {
    opacity: 0.5,
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
  propertyGroup: {
    marginBottom: 16,
  },
  propertyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  propertyInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 14,
  },
  emptyBox: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  footerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
