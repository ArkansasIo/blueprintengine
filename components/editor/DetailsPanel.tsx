import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlueprintClass, BlueprintNode } from '@/app/utils/ue5-blueprint-generator';

interface DetailsPanelProps {
  nodeId: string;
  blueprint: BlueprintClass | null;
  onPropertyChange: (property: string, value: any) => void;
}

interface PropertySection {
  title: string;
  icon: string;
  properties: PropertyItem[];
  collapsed?: boolean;
}

interface PropertyItem {
  name: string;
  displayName: string;
  type: 'string' | 'int' | 'float' | 'bool' | 'enum' | 'color';
  value: any;
  tooltip?: string;
  options?: string[];
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ nodeId, blueprint, onPropertyChange }) => {
  const node = blueprint?.eventGraphNodes.find((n) => n.id === nodeId);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    details: true,
    advanced: false,
  });

  if (!node) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Select a node to view details</Text>
      </View>
    );
  }

  const propertySections: PropertySection[] = [
    {
      title: 'General',
      icon: 'information',
      properties: [
        {
          name: 'label',
          displayName: 'Label',
          type: 'string',
          value: node.label,
          tooltip: 'Display name of the node',
        },
        {
          name: 'type',
          displayName: 'Node Type',
          type: 'string',
          value: node.type,
        },
        {
          name: 'color',
          displayName: 'Color',
          type: 'color',
          value: node.color || '#3b82f6',
        },
      ],
      collapsed: false,
    },
    {
      title: 'Details',
      icon: 'cog',
      properties: [
        {
          name: 'position.x',
          displayName: 'Position X',
          type: 'float',
          value: node.position.x,
        },
        {
          name: 'position.y',
          displayName: 'Position Y',
          type: 'float',
          value: node.position.y,
        },
        {
          name: 'comment',
          displayName: 'Comment',
          type: 'string',
          value: node.comment || '',
          tooltip: 'Internal notes about this node',
        },
      ],
      collapsed: false,
    },
    {
      title: 'Advanced',
      icon: 'wrench',
      properties: [
        {
          name: 'metadata',
          displayName: 'Metadata',
          type: 'string',
          value: JSON.stringify(node.metadata || {}),
        },
      ],
      collapsed: true,
    },
  ];

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle.toLowerCase()]: !prev[sectionTitle.toLowerCase()],
    }));
  };

  const renderPropertyInput = (prop: PropertyItem) => {
    switch (prop.type) {
      case 'string':
        return (
          <TextInput
            style={styles.textInput}
            value={String(prop.value)}
            onChangeText={(text) => onPropertyChange(prop.name, text)}
            placeholderTextColor="#475569"
            placeholder={prop.displayName}
          />
        );

      case 'int':
      case 'float':
        return (
          <TextInput
            style={styles.textInput}
            value={String(prop.value)}
            onChangeText={(text) => {
              const num = prop.type === 'int' ? parseInt(text) : parseFloat(text);
              onPropertyChange(prop.name, num);
            }}
            keyboardType="decimal-pad"
            placeholderTextColor="#475569"
          />
        );

      case 'bool':
        return (
          <Switch
            value={Boolean(prop.value)}
            onValueChange={(val) => onPropertyChange(prop.name, val)}
            trackColor={{ false: '#334155', true: '#06b6d4' }}
            thumbColor={Boolean(prop.value) ? '#0c4a6e' : '#64748b'}
          />
        );

      case 'color':
        return (
          <View style={styles.colorPickerContainer}>
            <View
              style={[
                styles.colorSwatch,
                { backgroundColor: prop.value },
              ]}
            />
            <TextInput
              style={styles.colorInput}
              value={String(prop.value)}
              onChangeText={(text) => onPropertyChange(prop.name, text)}
              placeholderTextColor="#475569"
            />
          </View>
        );

      case 'enum':
        return (
          <ScrollView horizontal style={styles.enumContainer}>
            {prop.options?.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.enumButton,
                  prop.value === option && styles.enumButtonSelected,
                ]}
                onPress={() => onPropertyChange(prop.name, option)}
              >
                <Text style={styles.enumButtonText}>{option}</Text>
              </Pressable>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="information" size={16} color="#06b6d4" />
        <Text style={styles.headerTitle}>Details</Text>
      </View>

      {/* Property Sections */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {propertySections.map((section, idx) => {
          const isExpanded = expandedSections[section.title.toLowerCase()] !== false;

          return (
            <View key={idx} style={styles.section}>
              {/* Section Header */}
              <Pressable
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.title)}
              >
                <MaterialCommunityIcons
                  name={isExpanded ? 'chevron-down' : 'chevron-right'}
                  size={16}
                  color="#cbd5e1"
                />
                <MaterialCommunityIcons
                  name={section.icon}
                  size={14}
                  color="#94a3b8"
                  style={{ marginLeft: 8 }}
                />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </Pressable>

              {/* Section Content */}
              {isExpanded && (
                <View style={styles.sectionContent}>
                  {section.properties.map((prop, propIdx) => (
                    <View key={propIdx} style={styles.propertyRow}>
                      <View style={styles.propertyLabel}>
                        <Text style={styles.propertyName}>{prop.displayName}</Text>
                        {prop.tooltip && (
                          <Text style={styles.tooltip}>{prop.tooltip}</Text>
                        )}
                      </View>
                      <View style={styles.propertyInput}>
                        {renderPropertyInput(prop)}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Pins Section */}
        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeader}
            onPress={() =>
              toggleSection('pins')
            }
          >
            <MaterialCommunityIcons
              name={expandedSections.pins ? 'chevron-down' : 'chevron-right'}
              size={16}
              color="#cbd5e1"
            />
            <MaterialCommunityIcons
              name="plug"
              size={14}
              color="#94a3b8"
              style={{ marginLeft: 8 }}
            />
            <Text style={styles.sectionTitle}>Pins ({node.pins.length})</Text>
          </Pressable>

          {expandedSections.pins && (
            <View style={styles.sectionContent}>
              {node.pins.map((pin, idx) => (
                <View key={idx} style={styles.pinRow}>
                  <View
                    style={[
                      styles.pinIndicator,
                      {
                        backgroundColor:
                          pin.direction === 'Input' ? '#3b82f6' : '#10b981',
                      },
                    ]}
                  />
                  <View style={styles.pinInfo}>
                    <Text style={styles.pinName}>{pin.name}</Text>
                    <Text style={styles.pinType}>{pin.type}</Text>
                  </View>
                  <View style={styles.pinBadge}>
                    <Text style={styles.pinDirection}>
                      {pin.direction === 'Input' ? 'In' : 'Out'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: '#1e293b',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    flexDirection: 'column',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },

  content: {
    flex: 1,
    paddingVertical: 8,
  },

  emptyContainer: {
    width: 300,
    backgroundColor: '#1e293b',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  emptyText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },

  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0f172a',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    marginLeft: 8,
  },

  sectionContent: {
    paddingVertical: 8,
  },

  propertyRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.5)',
  },

  propertyLabel: {
    marginBottom: 4,
  },

  propertyName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#cbd5e1',
  },

  tooltip: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    fontStyle: 'italic',
  },

  propertyInput: {
    marginTop: 4,
  },

  textInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: '#e2e8f0',
    fontSize: 11,
  },

  colorPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },

  colorInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: '#e2e8f0',
    fontSize: 11,
  },

  enumContainer: {
    flexGrow: 0,
  },

  enumButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 4,
  },

  enumButtonSelected: {
    backgroundColor: '#06b6d4',
    borderColor: '#0c4a6e',
  },

  enumButtonText: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.5)',
    gap: 8,
  },

  pinIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  pinInfo: {
    flex: 1,
  },

  pinName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#cbd5e1',
  },

  pinType: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },

  pinBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: '#334155',
  },

  pinDirection: {
    fontSize: 9,
    color: '#cbd5e1',
    fontWeight: '500',
  },
});

export default DetailsPanel;
