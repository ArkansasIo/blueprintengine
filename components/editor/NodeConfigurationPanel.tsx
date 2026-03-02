import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Pressable, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';
import { BlueprintNode, Pin } from '@/app/utils/ue5-blueprint-generator';

const dataTypes = ['bool', 'int', 'float', 'string', 'vector', 'color', 'object', 'array'];
const executionTypes = ['flow', 'data'];

export default function NodeConfigurationPanel() {
  const { selectedNodes, nodes, updateNode } = useEditorStore();
  const selectedNode = selectedNodes.length === 1 ? nodes.find((n) => n.id === selectedNodes[0]) : null;

  const [editingPin, setEditingPin] = useState<string | null>(null);
  const [pinnedOpen, setPinnedOpen] = useState(false);

  if (!selectedNode) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="selection-ellipse" size={48} color="#64748b" />
        <Text style={styles.emptyText}>Select a node to configure</Text>
      </View>
    );
  }

  const handleUpdateNode = (updates: Partial<BlueprintNode>) => {
    updateNode(selectedNode.id, updates);
  };

  const handleUpdatePin = (pinId: string, updates: Partial<Pin>) => {
    const updatedPins = selectedNode.pins.map((pin) =>
      pin.id === pinId ? { ...pin, ...updates } : pin
    );
    handleUpdateNode({ pins: updatedPins });
  };

  const handleAddPin = () => {
    const newPin: Pin = {
      id: `pin_${Date.now()}`,
      name: 'NewPin',
      type: 'data',
      direction: 'input',
      dataType: 'float',
      isArray: false,
      defaultValue: undefined,
    };
    handleUpdateNode({ pins: [...selectedNode.pins, newPin] });
  };

  const handleDeletePin = (pinId: string) => {
    const updatedPins = selectedNode.pins.filter((pin) => pin.id !== pinId);
    handleUpdateNode({ pins: updatedPins });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.nodeTypeIndicator, { backgroundColor: selectedNode.color }]} />
        <Text style={styles.headerTitle}>{selectedNode.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Node Properties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cog-outline" size={16} color="#06b6d4" />
            <Text style={styles.sectionTitle}>Node Properties</Text>
          </View>

          <View style={styles.propertyGroup}>
            <Text style={styles.propertyLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={selectedNode.title}
              onChangeText={(text) => handleUpdateNode({ title: text })}
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.propertyGroup}>
            <Text style={styles.propertyLabel}>Category</Text>
            <TextInput
              style={styles.textInput}
              value={selectedNode.category || ''}
              onChangeText={(text) => handleUpdateNode({ category: text })}
              placeholder="e.g., Math, String, Logic"
              placeholderTextColor="#64748b"
            />
          </View>

          <View style={styles.propertyGroup}>
            <Text style={styles.propertyLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={selectedNode.description || ''}
              onChangeText={(text) => handleUpdateNode({ description: text })}
              placeholder="Describe what this node does"
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.propertyGroup}>
            <Text style={styles.propertyLabel}>Type</Text>
            <View style={styles.typeSelector}>
              {['input', 'output', 'logic', 'condition', 'action'].map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.typeOption,
                    selectedNode.type === type && styles.typeOptionActive,
                  ]}
                  onPress={() => handleUpdateNode({ type: type as any })}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      selectedNode.type === type && styles.typeOptionTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.propertyGroup}>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>Enabled</Text>
              <Switch
                value={selectedNode.enabled !== false}
                onValueChange={(value) => handleUpdateNode({ enabled: value })}
                thumbColor={selectedNode.enabled !== false ? '#06b6d4' : '#cbd5e1'}
              />
            </View>
          </View>

          <View style={styles.propertyGroup}>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>Breakpoint</Text>
              <Switch
                value={selectedNode.breakpoint === true}
                onValueChange={(value) => handleUpdateNode({ breakpoint: value })}
                thumbColor={selectedNode.breakpoint === true ? '#ef4444' : '#cbd5e1'}
              />
            </View>
          </View>
        </View>

        {/* Pin Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="connection" size={16} color="#06b6d4" />
            <Text style={styles.sectionTitle}>Pins ({selectedNode.pins.length})</Text>
            <Pressable style={styles.expandButton} onPress={() => setPinnedOpen(!pinnedOpen)}>
              <MaterialCommunityIcons
                name={pinnedOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#06b6d4"
              />
            </Pressable>
          </View>

          {pinnedOpen && (
            <>
              <ScrollView style={styles.pinsList} scrollEnabled={false}>
                {selectedNode.pins.map((pin) => (
                  <View key={pin.id} style={styles.pinItem}>
                    <View style={styles.pinHeader}>
                      <View
                        style={[
                          styles.pinIndicator,
                          { backgroundColor: pin.type === 'flow' ? '#f59e0b' : '#3b82f6' },
                        ]}
                      />
                      <Text style={styles.pinName}>{pin.name}</Text>
                      <Pressable
                        style={styles.pinDeleteButton}
                        onPress={() => handleDeletePin(pin.id)}
                      >
                        <MaterialCommunityIcons name="close" size={14} color="#ef4444" />
                      </Pressable>
                    </View>

                    {editingPin === pin.id && (
                      <View style={styles.pinEditForm}>
                        <View style={styles.formGroup}>
                          <Text style={styles.formLabel}>Name</Text>
                          <TextInput
                            style={styles.formInput}
                            value={pin.name}
                            onChangeText={(text) => handleUpdatePin(pin.id, { name: text })}
                          />
                        </View>

                        <View style={styles.formGroup}>
                          <Text style={styles.formLabel}>Type</Text>
                          <View style={styles.typeSelect}>
                            {executionTypes.map((type) => (
                              <Pressable
                                key={type}
                                style={[
                                  styles.typeSelectOption,
                                  pin.type === type && styles.typeSelectOptionActive,
                                ]}
                                onPress={() => handleUpdatePin(pin.id, { type: type as any })}
                              >
                                <Text
                                  style={[
                                    styles.typeSelectOptionText,
                                    pin.type === type && styles.typeSelectOptionTextActive,
                                  ]}
                                >
                                  {type}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </View>

                        {pin.type === 'data' && (
                          <>
                            <View style={styles.formGroup}>
                              <Text style={styles.formLabel}>Data Type</Text>
                              <View style={styles.dataTypeSelect}>
                                {dataTypes.map((dt) => (
                                  <Pressable
                                    key={dt}
                                    style={[
                                      styles.dataTypeOption,
                                      pin.dataType === dt && styles.dataTypeOptionActive,
                                    ]}
                                    onPress={() => handleUpdatePin(pin.id, { dataType: dt })}
                                  >
                                    <Text
                                      style={[
                                        styles.dataTypeOptionText,
                                        pin.dataType === dt && styles.dataTypeOptionTextActive,
                                      ]}
                                    >
                                      {dt}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>

                            <View style={styles.formGroup}>
                              <View style={styles.checkboxRow}>
                                <Switch
                                  value={pin.isArray === true}
                                  onValueChange={(value) => handleUpdatePin(pin.id, { isArray: value })}
                                />
                                <Text style={styles.checkboxLabel}>Array</Text>
                              </View>
                            </View>

                            <View style={styles.formGroup}>
                              <Text style={styles.formLabel}>Default Value</Text>
                              <TextInput
                                style={styles.formInput}
                                value={String(pin.defaultValue || '')}
                                onChangeText={(text) =>
                                  handleUpdatePin(pin.id, { defaultValue: text })
                                }
                                placeholder="Optional"
                              />
                            </View>
                          </>
                        )}

                        <Pressable
                          style={styles.donButton}
                          onPress={() => setEditingPin(null)}
                        >
                          <Text style={styles.doneButtonText}>Done</Text>
                        </Pressable>
                      </View>
                    )}

                    {editingPin !== pin.id && (
                      <Pressable
                        style={styles.pinEditButton}
                        onPress={() => setEditingPin(pin.id)}
                      >
                        <Text style={styles.pinEditButtonText}>
                          {pin.direction} • {pin.type} • {pin.dataType}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </ScrollView>

              <Pressable style={styles.addPinButton} onPress={handleAddPin}>
                <MaterialCommunityIcons name="plus-circle" size={16} color="#06b6d4" />
                <Text style={styles.addPinButtonText}>Add Pin</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderLeftWidth: 1,
    borderLeftColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 10,
  },
  nodeTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
    textTransform: 'uppercase',
  },
  expandButton: {
    padding: 4,
  },
  propertyGroup: {
    marginBottom: 12,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propertyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#e2e8f0',
    fontSize: 12,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingVertical: 8,
    minHeight: 60,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  typeOptionActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  typeOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  typeOptionTextActive: {
    color: '#06b6d4',
  },
  pinsList: {
    marginBottom: 12,
  },
  pinItem: {
    marginBottom: 8,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 8,
  },
  pinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pinName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  pinDeleteButton: {
    padding: 4,
  },
  pinEditButton: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#0c4a6e',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  pinEditButtonText: {
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: '500',
  },
  pinEditForm: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  formGroup: {
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: '#e2e8f0',
    fontSize: 11,
  },
  typeSelect: {
    flexDirection: 'row',
    gap: 6,
  },
  typeSelectOption: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  typeSelectOptionActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  typeSelectOptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  typeSelectOptionTextActive: {
    color: '#06b6d4',
  },
  dataTypeSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dataTypeOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  dataTypeOptionActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  dataTypeOptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  dataTypeOptionTextActive: {
    color: '#06b6d4',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  donButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  doneButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  addPinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0c4a6e',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#06b6d4',
    gap: 6,
  },
  addPinButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#06b6d4',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 12,
  },
});
