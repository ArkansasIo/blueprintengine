import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NodeDefinition {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
  isFavorite: boolean;
}

const nodeLibrary: NodeDefinition[] = [
  // Logic Nodes
  {
    id: 'logic-branch',
    name: 'Branch',
    category: 'Logic',
    subcategory: 'Flow Control',
    description: 'Execute different paths based on a boolean condition',
    icon: 'call-split',
    color: '#3b82f6',
    inputs: 1,
    outputs: 2,
    isFavorite: false,
  },
  {
    id: 'logic-switch',
    name: 'Switch',
    category: 'Logic',
    subcategory: 'Flow Control',
    description: 'Execute one of multiple paths based on a value',
    icon: 'electric-switch',
    color: '#3b82f6',
    inputs: 1,
    outputs: 5,
    isFavorite: false,
  },
  {
    id: 'logic-and',
    name: 'And',
    category: 'Logic',
    subcategory: 'Boolean',
    description: 'Logical AND operation',
    icon: 'plus-circle-outline',
    color: '#3b82f6',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'logic-or',
    name: 'Or',
    category: 'Logic',
    subcategory: 'Boolean',
    description: 'Logical OR operation',
    icon: 'plus-circle-outline',
    color: '#3b82f6',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'logic-not',
    name: 'Not',
    category: 'Logic',
    subcategory: 'Boolean',
    description: 'Logical NOT operation',
    icon: 'close-circle-outline',
    color: '#3b82f6',
    inputs: 1,
    outputs: 1,
    isFavorite: false,
  },

  // Math Nodes
  {
    id: 'math-add',
    name: 'Add',
    category: 'Math',
    subcategory: 'Arithmetic',
    description: 'Add two numbers together',
    icon: 'plus',
    color: '#06b6d4',
    inputs: 2,
    outputs: 1,
    isFavorite: true,
  },
  {
    id: 'math-subtract',
    name: 'Subtract',
    category: 'Math',
    subcategory: 'Arithmetic',
    description: 'Subtract one number from another',
    icon: 'minus',
    color: '#06b6d4',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'math-multiply',
    name: 'Multiply',
    category: 'Math',
    subcategory: 'Arithmetic',
    description: 'Multiply two numbers',
    icon: 'multiplication',
    color: '#06b6d4',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'math-divide',
    name: 'Divide',
    category: 'Math',
    subcategory: 'Arithmetic',
    description: 'Divide one number by another',
    icon: 'division',
    color: '#06b6d4',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },

  // String Nodes
  {
    id: 'string-append',
    name: 'Append',
    category: 'String',
    subcategory: 'Manipulation',
    description: 'Concatenate strings together',
    icon: 'format-text',
    color: '#10b981',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'string-length',
    name: 'Length',
    category: 'String',
    subcategory: 'Manipulation',
    description: 'Get the length of a string',
    icon: 'order-numeric',
    color: '#10b981',
    inputs: 1,
    outputs: 1,
    isFavorite: false,
  },

  // Array Nodes
  {
    id: 'array-length',
    name: 'Length',
    category: 'Array',
    subcategory: 'Query',
    description: 'Get the length of an array',
    icon: 'format-list-numbered',
    color: '#f59e0b',
    inputs: 1,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'array-get',
    name: 'Get',
    category: 'Array',
    subcategory: 'Access',
    description: 'Get element at index',
    icon: 'inbox-multiple',
    color: '#f59e0b',
    inputs: 2,
    outputs: 1,
    isFavorite: false,
  },

  // Cast Nodes
  {
    id: 'cast-int-to-float',
    name: 'Int to Float',
    category: 'Cast',
    subcategory: 'Conversion',
    description: 'Convert integer to float',
    icon: 'arrow-right',
    color: '#8b5cf6',
    inputs: 1,
    outputs: 1,
    isFavorite: false,
  },
  {
    id: 'cast-to-string',
    name: 'To String',
    category: 'Cast',
    subcategory: 'Conversion',
    description: 'Convert value to string',
    icon: 'arrow-right',
    color: '#8b5cf6',
    inputs: 1,
    outputs: 1,
    isFavorite: false,
  },
];

export default function NodeLibraryBrowser() {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeDefinition | null>(null);

  const categories = Array.from(new Set(nodeLibrary.map((n) => n.category)));

  const filteredNodes = nodeLibrary.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchText.toLowerCase()) ||
      node.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || node.category === selectedCategory;
    const matchesFavorite = !showFavoritesOnly || node.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="library-shelves" size={18} color="#fff" />
        <Text style={styles.buttonText}>Nodes</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Node Library</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Search & Filter Bar */}
          <View style={styles.filterBar}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={16} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search nodes..."
                placeholderTextColor="#64748b"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => setSearchText('')}>
                  <MaterialCommunityIcons name="close-circle" size={16} color="#64748b" />
                </Pressable>
              )}
            </View>

            <Pressable
              style={[styles.favoritesButton, showFavoritesOnly && styles.favoritesButtonActive]}
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <MaterialCommunityIcons
                name={showFavoritesOnly ? 'star' : 'star-outline'}
                size={16}
                color={showFavoritesOnly ? '#f59e0b' : '#64748b'}
              />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Categories Sidebar */}
            <View style={styles.categoriesSidebar}>
              <Pressable
                style={[styles.categoryItem, !selectedCategory && styles.categoryItemActive]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryItemText,
                    !selectedCategory && styles.categoryItemTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>

              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.categoryItem, selectedCategory === cat && styles.categoryItemActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      selectedCategory === cat && styles.categoryItemTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Nodes List */}
            <ScrollView style={styles.nodesList}>
              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => (
                  <Pressable
                    key={node.id}
                    style={[
                      styles.nodeItem,
                      selectedNode?.id === node.id && styles.nodeItemSelected,
                    ]}
                    onPress={() => setSelectedNode(node)}
                  >
                    <View style={[styles.nodeIcon, { backgroundColor: node.color }]}>
                      <MaterialCommunityIcons name={node.icon as any} size={16} color="#fff" />
                    </View>
                    <View style={styles.nodeInfo}>
                      <Text style={styles.nodeName}>{node.name}</Text>
                      <Text style={styles.nodeCategory}>{node.subcategory}</Text>
                    </View>
                    <View style={styles.nodePins}>
                      <MaterialCommunityIcons name="arrow-left" size={12} color="#06b6d4" />
                      <Text style={styles.nodePinsText}>{node.inputs}</Text>
                      <Text style={styles.nodePinsDivider}>•</Text>
                      <Text style={styles.nodePinsText}>{node.outputs}</Text>
                      <MaterialCommunityIcons name="arrow-right" size={12} color="#06b6d4" />
                    </View>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="cube-outline" size={40} color="#64748b" />
                  <Text style={styles.emptyText}>No nodes found</Text>
                </View>
              )}
            </ScrollView>

            {/* Node Details Panel */}
            {selectedNode && (
              <View style={styles.detailsPanel}>
                <View style={styles.detailsHeader}>
                  <View
                    style={[
                      styles.detailsIconLarge,
                      { backgroundColor: selectedNode.color },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={selectedNode.icon as any}
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.detailsTitle}>
                    <Text style={styles.detailsName}>{selectedNode.name}</Text>
                    <Text style={styles.detailsCategory}>{selectedNode.category}</Text>
                  </View>
                </View>

                <ScrollView style={styles.detailsContent}>
                  <Text style={styles.detailsDescription}>{selectedNode.description}</Text>

                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsSectionTitle}>Pins</Text>
                    <View style={styles.pinsGrid}>
                      <View style={styles.pinGroup}>
                        <Text style={styles.pinGroupTitle}>Inputs</Text>
                        <Text style={styles.pinCount}>{selectedNode.inputs}</Text>
                      </View>
                      <View style={styles.pinGroup}>
                        <Text style={styles.pinGroupTitle}>Outputs</Text>
                        <Text style={styles.pinCount}>{selectedNode.outputs}</Text>
                      </View>
                    </View>
                  </View>

                  <Pressable
                    style={styles.addButton}
                    onPress={() => {
                      console.log('Adding node:', selectedNode?.name);
                      setSelectedNode(null);
                      setVisible(false);
                    }}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                    <Text style={styles.addButtonText}>Add to Blueprint</Text>
                  </Pressable>
                </ScrollView>
              </View>
            )}
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
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  modal: {
    flex: 1,
    backgroundColor: '#0f172a',
    marginTop: 40,
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
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#94a3b8',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 12,
  },
  favoritesButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritesButtonActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#654321',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  categoriesSidebar: {
    width: 120,
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  categoryItemActive: {
    borderLeftColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  categoryItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryItemTextActive: {
    color: '#06b6d4',
  },
  nodesList: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#1e293b',
    gap: 8,
  },
  nodeItemSelected: {
    backgroundColor: '#0c4a6e',
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  nodeIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  nodeCategory: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  nodePins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  nodePinsText: {
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: '600',
  },
  nodePinsDivider: {
    color: '#334155',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  detailsPanel: {
    width: 280,
    backgroundColor: '#1e293b',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 10,
  },
  detailsIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsTitle: {
    flex: 1,
  },
  detailsName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  detailsCategory: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  detailsContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  detailsDescription: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
    marginBottom: 12,
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailsSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pinsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  pinGroup: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  pinGroupTitle: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 4,
  },
  pinCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06b6d4',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    gap: 6,
    marginTop: 12,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
