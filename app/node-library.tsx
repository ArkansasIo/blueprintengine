import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NodeTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  inputs: number;
  outputs: number;
  popular: boolean;
}

const nodeTemplates: NodeTemplate[] = [
  // Flow Control
  {
    id: 'branch',
    name: 'Branch',
    category: 'Flow',
    icon: 'call-split',
    color: '#f59e0b',
    description: 'Conditional branching (if-then-else)',
    inputs: 1,
    outputs: 2,
    popular: true,
  },
  {
    id: 'sequence',
    name: 'Sequence',
    category: 'Flow',
    icon: 'playlist-play',
    color: '#f59e0b',
    description: 'Execute nodes in order',
    inputs: 1,
    outputs: 3,
    popular: true,
  },
  {
    id: 'for-loop',
    name: 'For Loop',
    category: 'Flow',
    icon: 'repeat',
    color: '#f59e0b',
    description: 'Loop iteration with index',
    inputs: 1,
    outputs: 3,
    popular: true,
  },
  {
    id: 'while-loop',
    name: 'While Loop',
    category: 'Flow',
    icon: 'repeat-variant',
    color: '#f59e0b',
    description: 'Loop while condition is true',
    inputs: 1,
    outputs: 2,
    popular: false,
  },
  // Events
  {
    id: 'event-begin-play',
    name: 'Event BeginPlay',
    category: 'Events',
    icon: 'play',
    color: '#ef4444',
    description: 'Fires when actor begins play',
    inputs: 0,
    outputs: 1,
    popular: true,
  },
  {
    id: 'event-tick',
    name: 'Event Tick',
    category: 'Events',
    icon: 'timer',
    color: '#ef4444',
    description: 'Fires every frame',
    inputs: 0,
    outputs: 2,
    popular: true,
  },
  {
    id: 'event-overlap',
    name: 'Event OnOverlap',
    category: 'Events',
    icon: 'plus-circle',
    color: '#ef4444',
    description: 'Fires on collision overlap',
    inputs: 0,
    outputs: 1,
    popular: true,
  },
  // Variables
  {
    id: 'get-variable',
    name: 'Get Variable',
    category: 'Variables',
    icon: 'arrow-right-circle',
    color: '#8b5cf6',
    description: 'Read a variable value',
    inputs: 0,
    outputs: 1,
    popular: true,
  },
  {
    id: 'set-variable',
    name: 'Set Variable',
    category: 'Variables',
    icon: 'arrow-left-circle',
    color: '#8b5cf6',
    description: 'Write a variable value',
    inputs: 1,
    outputs: 1,
    popular: true,
  },
  // Functions
  {
    id: 'function-call',
    name: 'Function Call',
    category: 'Functions',
    icon: 'play-circle-outline',
    color: '#3b82f6',
    description: 'Call a custom function',
    inputs: 1,
    outputs: 1,
    popular: true,
  },
  {
    id: 'pure-function',
    name: 'Pure Function',
    category: 'Functions',
    icon: 'circle-outline',
    color: '#3b82f6',
    description: 'Call a pure function',
    inputs: 0,
    outputs: 1,
    popular: false,
  },
  // Comments
  {
    id: 'comment',
    name: 'Comment',
    category: 'Comments',
    icon: 'message-text',
    color: '#10b981',
    description: 'Add notes to your blueprint',
    inputs: 0,
    outputs: 0,
    popular: false,
  },
];

export default function NodeLibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(nodeTemplates.map((n) => n.category))];

  const filteredTemplates = nodeTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularNodes = nodeTemplates.filter((n) => n.popular);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#06b6d4" />
        </Pressable>
        <Text style={styles.title}>Node Library</Text>
        <Pressable>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color="#cbd5e1"
          />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={18}
          color="#64748b"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search nodes..."
          placeholderTextColor="#475569"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#64748b"
            />
          </Pressable>
        )}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* Popular Section */}
        {searchQuery.length === 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Nodes</Text>
              <View style={styles.nodeGrid}>
                {popularNodes.map((node) => (
                  <Pressable
                    key={node.id}
                    style={styles.nodeCard}
                    onPress={() => {
                      // Add node to editor
                    }}
                  >
                    <View
                      style={[
                        styles.nodeIcon,
                        { backgroundColor: node.color + '20' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={node.icon}
                        size={24}
                        color={node.color}
                      />
                    </View>
                    <Text style={styles.nodeName}>{node.name}</Text>
                    <Text style={styles.nodeDesc} numberOfLines={2}>
                      {node.description}
                    </Text>
                    <View style={styles.nodePinInfo}>
                      <Text style={styles.pinCount}>
                        {node.inputs} in • {node.outputs} out
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoryList}>
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.categoryButtonActive,
                    ]}
                    onPress={() =>
                      setSelectedCategory(
                        selectedCategory === category ? null : category
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category &&
                          styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}

        {/* All Nodes / Search Results */}
        <View style={styles.section}>
          {filteredTemplates.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="magnify-close"
                size={48}
                color="#475569"
              />
              <Text style={styles.emptyText}>No nodes found</Text>
              <Text style={styles.emptySubtext}>Try a different search</Text>
            </View>
          ) : (
            <View style={styles.nodeList}>
              {filteredTemplates.map((node) => (
                <Pressable
                  key={node.id}
                  style={styles.nodeListItem}
                  onPress={() => {
                    // Add node to editor
                  }}
                >
                  <View
                    style={[
                      styles.nodeListIcon,
                      { backgroundColor: node.color + '20' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={node.icon}
                      size={20}
                      color={node.color}
                    />
                  </View>

                  <View style={styles.nodeListContent}>
                    <View style={styles.nodeListHeader}>
                      <Text style={styles.nodeListName}>{node.name}</Text>
                      <Text
                        style={[
                          styles.nodeCategory,
                          { color: node.color },
                        ]}
                      >
                        {node.category}
                      </Text>
                    </View>
                    <Text
                      style={styles.nodeListDesc}
                      numberOfLines={1}
                    >
                      {node.description}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color="#475569"
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },

  searchInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  section: {
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
  },

  nodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  nodeCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    gap: 8,
  },

  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nodeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  nodeDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 14,
  },

  nodePinInfo: {
    marginTop: 4,
  },

  pinCount: {
    fontSize: 9,
    color: '#475569',
  },

  categoriesSection: {
    marginVertical: 20,
  },

  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },

  categoryButtonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },

  categoryText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  categoryTextActive: {
    color: '#06b6d4',
  },

  nodeList: {
    gap: 8,
  },

  nodeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },

  nodeListIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nodeListContent: {
    flex: 1,
  },

  nodeListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },

  nodeListName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    flex: 1,
  },

  nodeCategory: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  nodeListDesc: {
    fontSize: 11,
    color: '#64748b',
  },

  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  emptySubtext: {
    fontSize: 13,
    color: '#64748b',
  },
});
