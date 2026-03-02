import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NodeComments() {
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState('');
  const { selectedNodeId, nodes, updateNode } = useEditorStore();

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  const handleSaveComment = () => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, {
        comment: comment.trim() || undefined,
      });
      Alert.alert('Success', 'Comment saved');
      setVisible(false);
      setComment('');
    }
  };

  const handleOpenComments = () => {
    if (!selectedNode) {
      Alert.alert('Info', 'Please select a node first');
      return;
    }
    setComment(selectedNode.comment || '');
    setVisible(true);
  };

  const hasComment = selectedNode?.comment && selectedNode.comment.length > 0;

  return (
    <>
      <Pressable
        style={[styles.button, hasComment && styles.buttonActive]}
        onPress={handleOpenComments}
      >
        <MaterialCommunityIcons name="comment-text" size={20} color="#fff" />
        <Text style={styles.buttonText}>Notes</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Node Notes</Text>
              <Pressable onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            {/* Node Info */}
            <View style={styles.nodeInfo}>
              <Text style={styles.nodeLabel}>{selectedNode?.label}</Text>
              <Text style={styles.nodeType}>{selectedNode?.type}</Text>
            </View>

            {/* Comment Input */}
            <TextInput
              style={styles.input}
              placeholder="Add notes about this node..."
              placeholderTextColor="#64748b"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={6}
            />

            {/* Character count */}
            <Text style={styles.charCount}>{comment.length} characters</Text>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setVisible(false);
                  setComment('');
                }}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveComment}
              >
                <Text style={styles.actionButtonText}>Save</Text>
              </Pressable>
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
  buttonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 16,
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
  nodeInfo: {
    marginBottom: 16,
  },
  nodeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  nodeType: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#e2e8f0',
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  saveButton: {
    backgroundColor: '#06b6d4',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
