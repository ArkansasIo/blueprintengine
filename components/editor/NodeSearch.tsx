import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NodeSearch() {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { nodes, selectNode } = useEditorStore();

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    const query = searchQuery.toLowerCase();
    return nodes.filter(
      (node) =>
        node.label.toLowerCase().includes(query) ||
        node.type.toLowerCase().includes(query)
    );
  }, [searchQuery, nodes]);

  const handleSelectNode = (nodeId: string) => {
    selectNode(nodeId);
    setVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
        <Text style={styles.buttonText}>Find</Text>
      </Pressable>

      <Modal visible={visible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#64748b"
              />
              <TextInput
                style={styles.input}
                placeholder="Search nodes..."
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#64748b"
                  />
                </Pressable>
              )}
            </View>

            {/* Results */}
            {filteredNodes.length > 0 ? (
              <FlatList
                data={filteredNodes}
                scrollEnabled
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.resultItem}
                    onPress={() => handleSelectNode(item.id)}
                  >
                    <View
                      style={[
                        styles.nodeIndicator,
                        { backgroundColor: getNodeColor(item.type) },
                      ]}
                    />
                    <View style={styles.nodeContent}>
                      <Text style={styles.nodeLabel}>{item.label}</Text>
                      <Text style={styles.nodeType}>{item.type}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#64748b"
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                style={styles.list}
              />
            ) : (
              <View style={styles.empty}>
                <MaterialCommunityIcons
                  name="inbox"
                  size={48}
                  color="#64748b"
                />
                <Text style={styles.emptyText}>No nodes found</Text>
              </View>
            )}

            {/* Close button */}
            <Pressable
              style={styles.closeArea}
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

function getNodeColor(type: string): string {
  switch (type) {
    case 'input':
      return '#3b82f6';
    case 'output':
      return '#10b981';
    case 'logic':
      return '#f59e0b';
    case 'condition':
      return '#ef4444';
    case 'action':
      return '#8b5cf6';
    default:
      return '#64748b';
  }
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  modal: {
    marginHorizontal: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    maxHeight: 400,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    color: '#e2e8f0',
    fontSize: 14,
  },
  list: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  nodeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  nodeContent: {
    flex: 1,
  },
  nodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  nodeType: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#64748b',
    marginTop: 12,
    fontSize: 14,
  },
  closeArea: {
    flex: 1,
  },
});
