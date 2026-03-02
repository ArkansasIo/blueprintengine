import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Text,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEditorStore } from './stores/editor-store';
import {
  getBlueprints,
  saveBlueprint,
  loadBlueprint,
  deleteBlueprint,
  createNewBlueprint,
} from './utils/blueprint-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BlueprintsScreen() {
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const { loadBlueprint: loadToEditor } = useEditorStore();

  useEffect(() => {
    loadBlueprintsList();
  }, []);

  const loadBlueprintsList = async () => {
    const list = await getBlueprints();
    setBlueprints(list);
  };

  const createNewBlueprint = async () => {
    if (!blueprintName.trim()) {
      Alert.alert('Error', 'Please enter a blueprint name');
      return;
    }

    const bp = {
      id: Math.random().toString(36).substr(2, 9),
      name: blueprintName,
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveBlueprint(bp);
    loadBlueprintsList();
    setBlueprintName('');
    setCreateModalVisible(false);
    
    // Open blueprint in editor
    loadToEditor(bp);
    router.push('/editor');
  };

  const openBlueprint = async (id: string) => {
    const bp = await loadBlueprint(id);
    if (bp) {
      loadToEditor(bp);
      router.push('/editor');
    }
  };

  const deleteBlueprintItem = async (id: string) => {
    Alert.alert('Delete Blueprint', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteBlueprint(id);
          loadBlueprintsList();
        },
        style: 'destructive',
      },
    ]);
  };

  const exportBlueprint = async (bp: any) => {
    try {
      const json = JSON.stringify(bp, null, 2);
      await Share.share({
        message: json,
        title: `${bp.name}.json`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export blueprint');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Blueprints</Text>
        <Pressable
          style={styles.createButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Blueprints List */}
      {blueprints.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="folder-open" size={48} color="#475569" />
          <Text style={styles.emptyText}>No blueprints yet</Text>
          <Pressable
            style={styles.emptyButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <Text style={styles.emptyButtonText}>Create First Blueprint</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={blueprints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.blueprintItem}
              onPress={() => openBlueprint(item.id)}
            >
              <View style={styles.blueprintInfo}>
                <Text style={styles.blueprintName}>{item.name}</Text>
                <Text style={styles.blueprintDate}>
                  Updated: {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.blueprintActions}>
                <Pressable
                  onPress={() => {
                    const bp = blueprints.find((b) => b.id === item.id);
                    exportBlueprint(bp);
                  }}
                  style={styles.actionButton}
                >
                  <MaterialCommunityIcons
                    name="download"
                    size={20}
                    color="#3b82f6"
                  />
                </Pressable>
                <Pressable
                  onPress={() => deleteBlueprintItem(item.id)}
                  style={styles.actionButton}
                >
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={20}
                    color="#ef4444"
                  />
                </Pressable>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Modal */}
      <Modal visible={createModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Blueprint</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Blueprint name..."
              placeholderTextColor="#64748b"
              value={blueprintName}
              onChangeText={setBlueprintName}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setCreateModalVisible(false);
                  setBlueprintName('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.createButton2]}
                onPress={createNewBlueprint}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 12,
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  blueprintItem: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  blueprintInfo: {
    flex: 1,
  },
  blueprintName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  blueprintDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  blueprintActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  createButton2: {
    backgroundColor: '#3b82f6',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
