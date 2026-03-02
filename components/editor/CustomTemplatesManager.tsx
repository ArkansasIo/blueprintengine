import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  saveCustomTemplate,
  getCustomTemplates,
  deleteCustomTemplate,
  updateTemplateUsage,
  CustomNodeTemplate,
  createNodeFromTemplate,
} from '../../app/utils/custom-templates';
import { NodeType } from '../../app/types/editor';

const nodeTypes: NodeType[] = ['input', 'output', 'logic', 'condition', 'action'];

const typeColors: Record<NodeType, string> = {
  input: '#3b82f6',
  output: '#10b981',
  logic: '#f59e0b',
  condition: '#ef4444',
  action: '#8b5cf6',
};

export default function CustomTemplatesManager() {
  const [visible, setVisible] = useState(false);
  const [templates, setTemplates] = useState<CustomNodeTemplate[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<NodeType>('logic');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const { selectedNodeId, nodes, addNode } = useEditorStore();

  useEffect(() => {
    if (visible) {
      loadTemplates();
    }
  }, [visible]);

  const loadTemplates = async () => {
    try {
      const list = await getCustomTemplates();
      setTemplates(list.sort((a, b) => b.usageCount - a.usageCount));
    } catch (error) {
      Alert.alert('Error', 'Failed to load templates');
    }
  };

  const handleSaveTemplate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    if (!selectedNodeId) {
      Alert.alert('Error', 'Please select a node to save as template');
      return;
    }

    try {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (!node) return;

      await saveCustomTemplate(
        name,
        description,
        selectedType,
        node.color || typeColors[selectedType],
        node.pins,
        node.data
      );

      Alert.alert('Success', 'Template saved');
      setName('');
      setDescription('');
      setSelectedType('logic');
      loadTemplates();
    } catch (error) {
      Alert.alert('Error', 'Failed to save template');
    }
  };

  const handleUseTemplate = async (template: CustomNodeTemplate) => {
    try {
      const newNode = createNodeFromTemplate(template, {
        x: Math.random() * 200,
        y: Math.random() * 200,
      });
      addNode(newNode);
      await updateTemplateUsage(template.id);
      Alert.alert('Success', `Created node from "${template.name}"`);
      setVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create node from template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteCustomTemplate(id);
      loadTemplates();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete template');
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="package-variant-plus" size={20} color="#fff" />
        <Text style={styles.buttonText}>Templates</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Custom Templates</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Save Current Node */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Save Current Node</Text>

              <TextInput
                style={styles.input}
                placeholder="Template name"
                placeholderTextColor="#64748b"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Description (optional)"
                placeholderTextColor="#64748b"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.typePickerContainer}>
                <Text style={styles.label}>Node Type</Text>
                <Pressable
                  style={styles.typeDropdownButton}
                  onPress={() => setTypeDropdownOpen(!typeDropdownOpen)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View
                      style={[
                        styles.typeIndicatorSmall,
                        { backgroundColor: typeColors[selectedType] },
                      ]}
                    />
                    <Text style={styles.typeDropdownText}>{selectedType}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={typeDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#cbd5e1"
                  />
                </Pressable>

                {typeDropdownOpen && (
                  <View style={styles.typeDropdownMenu}>
                    {nodeTypes.map((type) => (
                      <Pressable
                        key={type}
                        style={[
                          styles.typeDropdownItem,
                          selectedType === type && styles.typeDropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedType(type);
                          setTypeDropdownOpen(false);
                        }}
                      >
                        <View
                          style={[
                            styles.typeIndicatorSmall,
                            { backgroundColor: typeColors[type] },
                          ]}
                        />
                        <Text
                          style={[
                            styles.typeDropdownItemText,
                            selectedType === type && styles.typeDropdownItemTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <Pressable
                style={[
                  styles.saveButton,
                  !selectedNodeId && styles.buttonDisabled,
                ]}
                onPress={handleSaveTemplate}
                disabled={!selectedNodeId}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                <Text style={styles.buttonText}>Save as Template</Text>
              </Pressable>
            </View>

            {/* Browse Templates */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Browse Templates ({templates.length})
              </Text>

              {templates.length > 0 ? (
                <FlatList
                  data={templates}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <View style={styles.templateCard}>
                      <View style={styles.templateHeader}>
                        <View
                          style={[
                            styles.typeIndicator,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <View style={styles.templateInfo}>
                          <Text style={styles.templateName}>{item.name}</Text>
                          {item.description && (
                            <Text style={styles.templateDescription}>
                              {item.description}
                            </Text>
                          )}
                          <Text style={styles.templateMeta}>
                            {item.type} • {item.pins.length} pins • Used {item.usageCount}x
                          </Text>
                        </View>
                      </View>

                      <View style={styles.templateActions}>
                        <Pressable
                          style={styles.useButton}
                          onPress={() => handleUseTemplate(item)}
                        >
                          <MaterialCommunityIcons
                            name="plus-circle-outline"
                            size={18}
                            color="#06b6d4"
                          />
                        </Pressable>

                        <Pressable
                          style={styles.deleteButton}
                          onPress={() => {
                            Alert.alert(
                              'Delete Template',
                              `Remove "${item.name}"?`,
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Delete',
                                  style: 'destructive',
                                  onPress: () => handleDeleteTemplate(item.id),
                                },
                              ]
                            );
                          }}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={18}
                            color="#ef4444"
                          />
                        </Pressable>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={48}
                    color="#64748b"
                  />
                  <Text style={styles.emptyText}>No custom templates</Text>
                  <Text style={styles.emptySubtext}>
                    Save a node configuration above
                  </Text>
                </View>
              )}
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
  buttonDisabled: {
    opacity: 0.5,
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
    fontSize: 14,
    marginBottom: 12,
  },
  descriptionInput: {
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  typePickerContainer: {
    marginBottom: 16,
  },
  typeDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  typeDropdownText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
    marginLeft: 8,
  },
  typeIndicatorSmall: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  typeDropdownMenu: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  typeDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  typeDropdownItemActive: {
    backgroundColor: '#0c4a6e',
  },
  typeDropdownItemText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginLeft: 8,
  },
  typeDropdownItemTextActive: {
    color: '#06b6d4',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  templateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    marginTop: 2,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  templateMeta: {
    fontSize: 11,
    color: '#64748b',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  useButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#0c4a6e',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#7f1d1d',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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