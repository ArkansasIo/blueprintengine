import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Pressable, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InspectorSection {
  id: string;
  title: string;
  icon: string;
  expanded: boolean;
}

export default function BlueprintInspector() {
  const [sections, setSections] = useState<InspectorSection[]>([
    { id: 'general', title: 'General', icon: 'information', expanded: true },
    { id: 'variables', title: 'Variables', icon: 'variable-box', expanded: true },
    { id: 'functions', title: 'Functions', icon: 'function', expanded: true },
    { id: 'events', title: 'Events', icon: 'bell', expanded: false },
    { id: 'advanced', title: 'Advanced', icon: 'cog', expanded: false },
  ]);

  const toggleSection = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* General Section */}
        {sections[0] && (
          <View style={styles.section}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => toggleSection('general')}
            >
              <MaterialCommunityIcons
                name={sections[0].icon as any}
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.sectionTitle}>{sections[0].title}</Text>
              <MaterialCommunityIcons
                name={sections[0].expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748b"
              />
            </Pressable>

            {sections[0].expanded && (
              <View style={styles.sectionContent}>
                <View style={styles.propertyGroup}>
                  <Text style={styles.propertyLabel}>Blueprint Name</Text>
                  <TextInput
                    style={styles.propertyInput}
                    placeholder="Enter blueprint name..."
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.propertyGroup}>
                  <Text style={styles.propertyLabel}>Parent Class</Text>
                  <TextInput
                    style={styles.propertyInput}
                    placeholder="Select parent class..."
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.propertyGroup}>
                  <Text style={styles.propertyLabel}>Description</Text>
                  <TextInput
                    style={[styles.propertyInput, styles.propertyInputMultiline]}
                    placeholder="Enter description..."
                    placeholderTextColor="#64748b"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.propertyGroup}>
                  <View style={styles.propertyRow}>
                    <Text style={styles.propertyLabel}>Compile On Save</Text>
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      thumbColor="#06b6d4"
                    />
                  </View>
                </View>

                <View style={styles.propertyGroup}>
                  <View style={styles.propertyRow}>
                    <Text style={styles.propertyLabel}>Is Editable</Text>
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      thumbColor="#06b6d4"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Variables Section */}
        {sections[1] && (
          <View style={styles.section}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => toggleSection('variables')}
            >
              <MaterialCommunityIcons
                name={sections[1].icon as any}
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.sectionTitle}>{sections[1].title}</Text>
              <MaterialCommunityIcons
                name={sections[1].expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748b"
              />
            </Pressable>

            {sections[1].expanded && (
              <View style={styles.sectionContent}>
                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>Health</Text>
                    <Text style={styles.listItemSubtitle}>Float</Text>
                  </View>
                  <MaterialCommunityIcons name="pencil" size={14} color="#06b6d4" />
                </View>

                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>IsAlive</Text>
                    <Text style={styles.listItemSubtitle}>Boolean</Text>
                  </View>
                  <MaterialCommunityIcons name="pencil" size={14} color="#06b6d4" />
                </View>

                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>InventoryItems</Text>
                    <Text style={styles.listItemSubtitle}>Array of Objects</Text>
                  </View>
                  <MaterialCommunityIcons name="pencil" size={14} color="#06b6d4" />
                </View>

                <Pressable
                  style={styles.addButton}
                  onPress={() => console.log('Adding variable')}
                >
                  <MaterialCommunityIcons name="plus" size={14} color="#06b6d4" />
                  <Text style={styles.addButtonText}>Add Variable</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Functions Section */}
        {sections[2] && (
          <View style={styles.section}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => toggleSection('functions')}
            >
              <MaterialCommunityIcons
                name={sections[2].icon as any}
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.sectionTitle}>{sections[2].title}</Text>
              <MaterialCommunityIcons
                name={sections[2].expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748b"
              />
            </Pressable>

            {sections[2].expanded && (
              <View style={styles.sectionContent}>
                <View style={styles.listItem}>
                  <View style={[styles.listItemContent, { flex: 1 }]}>
                    <Text style={styles.listItemTitle}>TakeDamage</Text>
                    <Text style={styles.listItemSubtitle}>void (Float damage)</Text>
                  </View>
                  <MaterialCommunityIcons name="pencil" size={14} color="#06b6d4" />
                </View>

                <View style={styles.listItem}>
                  <View style={[styles.listItemContent, { flex: 1 }]}>
                    <Text style={styles.listItemTitle}>Die</Text>
                    <Text style={styles.listItemSubtitle}>void ()</Text>
                  </View>
                  <MaterialCommunityIcons name="pencil" size={14} color="#06b6d4" />
                </View>

                <Pressable
                  style={styles.addButton}
                  onPress={() => console.log('Adding function')}
                >
                  <MaterialCommunityIcons name="plus" size={14} color="#06b6d4" />
                  <Text style={styles.addButtonText}>Add Function</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Events Section */}
        {sections[3] && (
          <View style={styles.section}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => toggleSection('events')}
            >
              <MaterialCommunityIcons
                name={sections[3].icon as any}
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.sectionTitle}>{sections[3].title}</Text>
              <MaterialCommunityIcons
                name={sections[3].expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748b"
              />
            </Pressable>

            {sections[3].expanded && (
              <View style={styles.sectionContent}>
                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>Event Begin Play</Text>
                    <Text style={styles.listItemSubtitle}>Triggered on spawn</Text>
                  </View>
                  <MaterialCommunityIcons name="link" size={14} color="#10b981" />
                </View>

                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>Event End Play</Text>
                    <Text style={styles.listItemSubtitle}>Triggered on destroy</Text>
                  </View>
                  <MaterialCommunityIcons name="link" size={14} color="#10b981" />
                </View>

                <Pressable
                  style={styles.addButton}
                  onPress={() => console.log('Adding event')}
                >
                  <MaterialCommunityIcons name="plus" size={14} color="#06b6d4" />
                  <Text style={styles.addButtonText}>Add Event</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Advanced Section */}
        {sections[4] && (
          <View style={styles.section}>
            <Pressable
              style={styles.sectionHeader}
              onPress={() => toggleSection('advanced')}
            >
              <MaterialCommunityIcons
                name={sections[4].icon as any}
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.sectionTitle}>{sections[4].title}</Text>
              <MaterialCommunityIcons
                name={sections[4].expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#64748b"
              />
            </Pressable>

            {sections[4].expanded && (
              <View style={styles.sectionContent}>
                <View style={styles.propertyGroup}>
                  <View style={styles.propertyRow}>
                    <Text style={styles.propertyLabel}>Use Fast Calls</Text>
                    <Switch
                      value={false}
                      onValueChange={() => {}}
                      thumbColor="#06b6d4"
                    />
                  </View>
                </View>

                <View style={styles.propertyGroup}>
                  <View style={styles.propertyRow}>
                    <Text style={styles.propertyLabel}>Recompile On Load</Text>
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      thumbColor="#06b6d4"
                    />
                  </View>
                </View>

                <View style={styles.propertyGroup}>
                  <View style={styles.propertyRow}>
                    <Text style={styles.propertyLabel}>Const</Text>
                    <Switch
                      value={false}
                      onValueChange={() => {}}
                      thumbColor="#06b6d4"
                    />
                  </View>
                </View>

                <View style={styles.propertyGroup}>
                  <Text style={styles.propertyLabel}>Package</Text>
                  <TextInput
                    style={styles.propertyInput}
                    placeholder="Blueprint package..."
                    placeholderTextColor="#64748b"
                  />
                </View>
              </View>
            )}
          </View>
        )}
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
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 8,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  sectionContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  propertyGroup: {
    marginBottom: 12,
    marginTop: 12,
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
  propertyInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#e2e8f0',
    fontSize: 11,
  },
  propertyInputMultiline: {
    textAlignVertical: 'top',
    minHeight: 70,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  listItemSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#06b6d4',
  },
});
