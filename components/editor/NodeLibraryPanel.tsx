import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { RPG_NODE_TEMPLATES, createNodeFromTemplate } from '../../app/types/node-library';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NodeLibraryPanel() {
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addNode } = useEditorStore();

  const categories = Array.from(
    new Set(RPG_NODE_TEMPLATES.map((t) => t.category))
  ).sort();

  const filteredTemplates = selectedCategory
    ? RPG_NODE_TEMPLATES.filter((t) => t.category === selectedCategory)
    : RPG_NODE_TEMPLATES;

  const handleAddNode = (templateId: string) => {
    const template = RPG_NODE_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const node = createNodeFromTemplate(template);
      addNode(node);
      setVisible(false);
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="library-plus" size={20} color="#fff" />
        <Text style={styles.buttonText}>Library</Text>
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

          <View style={styles.content}>
            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
            >
              <Pressable
                style={[
                  styles.categoryButton,
                  !selectedCategory && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    !selectedCategory && styles.categoryButtonTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === cat &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Templates List */}
            <FlatList
              data={filteredTemplates}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.templateItem}
                  onPress={() => handleAddNode(item.id)}
                >
                  <View>
                    <Text style={styles.templateName}>{item.name}</Text>
                    <Text style={styles.templateDesc}>{item.description}</Text>
                  </View>
                </Pressable>
              )}
            />
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
    borderColor: '#8b5cf6',
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
  },
  categoriesScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  templateItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  templateName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  templateDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});