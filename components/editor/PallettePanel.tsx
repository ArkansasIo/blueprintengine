import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NodeCategory {
  name: string;
  icon: string;
  color: string;
  nodes: NodeType[];
  collapsed?: boolean;
}

interface NodeType {
  id: string;
  name: string;
  type: string;
  category: string;
  icon: string;
  description: string;
  color: string;
}

interface PalletePanelProps {
  onNodeTypeSelected: (nodeType: NodeType) => void;
}

const PalettePanel: React.FC<PalletePanelProps> = ({ onNodeTypeSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Flow Control': true,
    'Events': true,
    'Variables': false,
    'Functions': false,
    'Comments': false,
  });

  const nodeCategories: NodeCategory[] = [
    {
      name: 'Flow Control',
      icon: 'call-split',
      color: '#f59e0b',
      nodes: [
        {
          id: 'branch',
          name: 'Branch',
          type: 'Branch',
          category: 'Flow',
          icon: 'call-split',
          description: 'If-then-else control flow',
          color: '#f59e0b',
        },
        {
          id: 'sequence',
          name: 'Sequence',
          type: 'Sequence',
          category: 'Flow',
          icon: 'playlist-play',
          description: 'Execute nodes in sequence',
          color: '#f59e0b',
        },
        {
          id: 'loop',
          name: 'For Loop',
          type: 'ForLoop',
          category: 'Flow',
          icon: 'repeat',
          description: 'Loop through a range',
          color: '#f59e0b',
        },
        {
          id: 'gate',
          name: 'Gate',
          type: 'Gate',
          category: 'Flow',
          icon: 'gate',
          description: 'Gate control flow',
          color: '#f59e0b',
        },
      ],
    },
    {
      name: 'Events',
      icon: 'lightning-bolt',
      color: '#ef4444',
      nodes: [
        {
          id: 'event-begin-play',
          name: 'Event BeginPlay',
          type: 'Event',
          category: 'Events',
          icon: 'play',
          description: 'Called when actor begins play',
          color: '#ef4444',
        },
        {
          id: 'event-tick',
          name: 'Event Tick',
          type: 'Event',
          category: 'Events',
          icon: 'timer',
          description: 'Called every frame',
          color: '#ef4444',
        },
        {
          id: 'event-overlapping',
          name: 'Event Overlapping',
          type: 'Event',
          category: 'Events',
          icon: 'plus-circle',
          description: 'Called when overlap begins',
          color: '#ef4444',
        },
        {
          id: 'event-hit',
          name: 'Event Hit',
          type: 'Event',
          category: 'Events',
          icon: 'lightning-bolt',
          description: 'Called on collision',
          color: '#ef4444',
        },
      ],
    },
    {
      name: 'Variables',
      icon: 'variable-box',
      color: '#8b5cf6',
      nodes: [
        {
          id: 'get-variable',
          name: 'Get Variable',
          type: 'GetVariable',
          category: 'Variables',
          icon: 'arrow-right-circle',
          description: 'Read variable value',
          color: '#8b5cf6',
        },
        {
          id: 'set-variable',
          name: 'Set Variable',
          type: 'SetVariable',
          category: 'Variables',
          icon: 'arrow-left-circle',
          description: 'Write variable value',
          color: '#8b5cf6',
        },
      ],
    },
    {
      name: 'Functions',
      icon: 'function',
      color: '#3b82f6',
      nodes: [
        {
          id: 'function-call',
          name: 'Function Call',
          type: 'FunctionCall',
          category: 'Functions',
          icon: 'play-circle-outline',
          description: 'Call a function',
          color: '#3b82f6',
        },
        {
          id: 'pure-call',
          name: 'Pure Function',
          type: 'PureFunctionCall',
          category: 'Functions',
          icon: 'circle-outline',
          description: 'Pure function (no side effects)',
          color: '#3b82f6',
        },
      ],
    },
    {
      name: 'Comments',
      icon: 'comment-text',
      color: '#10b981',
      nodes: [
        {
          id: 'comment',
          name: 'Comment',
          type: 'Comment',
          category: 'Comments',
          icon: 'message-text',
          description: 'Add a comment node',
          color: '#10b981',
        },
      ],
    },
  ];

  const filteredCategories = nodeCategories
    .map((category) => ({
      ...category,
      nodes: category.nodes.filter(
        (node) =>
          node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.nodes.length > 0);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleNodeDragStart = (nodeType: NodeType) => {
    onNodeTypeSelected(nodeType);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="palette" size={16} color="#06b6d4" />
        <Text style={styles.headerTitle}>Palette</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={16} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search nodes..."
          placeholderTextColor="#475569"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Node Categories */}
      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={true}>
        {filteredCategories.map((category, idx) => {
          const isExpanded = expandedCategories[category.name] !== false;

          return (
            <View key={idx} style={styles.categorySection}>
              {/* Category Header */}
              <Pressable
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category.name)}
              >
                <MaterialCommunityIcons
                  name={isExpanded ? 'chevron-down' : 'chevron-right'}
                  size={16}
                  color="#cbd5e1"
                />
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={14}
                    color={category.color}
                  />
                </View>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.nodes.length}</Text>
              </Pressable>

              {/* Category Nodes */}
              {isExpanded && (
                <View style={styles.nodesContainer}>
                  {category.nodes.map((node, nodeIdx) => (
                    <Pressable
                      key={nodeIdx}
                      style={styles.nodeItem}
                      onPress={() => handleNodeDragStart(node)}
                      onLongPress={() => handleNodeDragStart(node)}
                    >
                      <View
                        style={[
                          styles.nodeIcon,
                          { backgroundColor: node.color + '20' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={node.icon}
                          size={12}
                          color={node.color}
                        />
                      </View>
                      <View style={styles.nodeInfo}>
                        <Text style={styles.nodeName}>{node.name}</Text>
                        <Text style={styles.nodeDescription}>{node.description}</Text>
                      </View>
                      <MaterialCommunityIcons
                        name="drag-vertical"
                        size={14}
                        color="#475569"
                      />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {filteredCategories.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="magnify-close" size={32} color="#475569" />
            <Text style={styles.emptyText}>No nodes found</Text>
            <Text style={styles.emptySubtext}>Try a different search</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Drag nodes to canvas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },

  searchInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 12,
    padding: 0,
  },

  categoriesContainer: {
    flex: 1,
  },

  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },

  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    gap: 8,
  },

  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  categoryCount: {
    fontSize: 10,
    color: '#64748b',
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },

  nodesContainer: {
    paddingVertical: 4,
  },

  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.5)',
  },

  nodeIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nodeInfo: {
    flex: 1,
  },

  nodeName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#cbd5e1',
  },

  nodeDescription: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },

  emptyText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  emptySubtext: {
    fontSize: 11,
    color: '#64748b',
  },

  footer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0f172a',
  },

  footerText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default PalettePanel;
