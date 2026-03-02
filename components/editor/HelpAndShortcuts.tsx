import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, TextInput, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Shortcut {
  keys: string;
  action: string;
  category: string;
}

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const shortcuts: Shortcut[] = [
  // File Operations
  { keys: 'Ctrl+N', action: 'New Blueprint', category: 'File' },
  { keys: 'Ctrl+O', action: 'Open Blueprint', category: 'File' },
  { keys: 'Ctrl+S', action: 'Save Blueprint', category: 'File' },
  { keys: 'Ctrl+Shift+S', action: 'Save As', category: 'File' },
  { keys: 'Ctrl+E', action: 'Export Blueprint', category: 'File' },
  { keys: 'Ctrl+I', action: 'Import Blueprint', category: 'File' },

  // Edit Operations
  { keys: 'Ctrl+Z', action: 'Undo', category: 'Edit' },
  { keys: 'Ctrl+Y', action: 'Redo', category: 'Edit' },
  { keys: 'Ctrl+X', action: 'Cut', category: 'Edit' },
  { keys: 'Ctrl+C', action: 'Copy', category: 'Edit' },
  { keys: 'Ctrl+V', action: 'Paste', category: 'Edit' },
  { keys: 'Ctrl+D', action: 'Duplicate', category: 'Edit' },
  { keys: 'Delete', action: 'Delete Selected', category: 'Edit' },
  { keys: 'Ctrl+A', action: 'Select All', category: 'Edit' },
  { keys: 'Ctrl+Shift+A', action: 'Deselect All', category: 'Edit' },

  // View Controls
  { keys: 'Ctrl+Plus', action: 'Zoom In', category: 'View' },
  { keys: 'Ctrl+Minus', action: 'Zoom Out', category: 'View' },
  { keys: 'Ctrl+0', action: 'Zoom to Fit', category: 'View' },
  { keys: 'Ctrl+G', action: 'Toggle Grid', category: 'View' },
  { keys: 'Ctrl+L', action: 'Toggle Dark Mode', category: 'View' },
  { keys: 'Ctrl+T', action: 'Toggle Node Tree', category: 'View' },
  { keys: 'Ctrl+P', action: 'Toggle Details Panel', category: 'View' },

  // Tools & Operations
  { keys: 'F5', action: 'Compile Blueprint', category: 'Tools' },
  { keys: 'Ctrl+Shift+V', action: 'Validate Blueprint', category: 'Tools' },
  { keys: 'Ctrl+F', action: 'Search Nodes', category: 'Tools' },
  { keys: 'Ctrl+L', action: 'Node Library', category: 'Tools' },
  { keys: 'Ctrl+,', action: 'Preferences', category: 'Tools' },
  { keys: 'Ctrl+Shift+?', action: 'Show Shortcuts', category: 'Tools' },

  // Navigation
  { keys: 'Space', action: 'Pan Canvas', category: 'Navigation' },
  { keys: 'Middle Mouse', action: 'Middle Mouse Drag', category: 'Navigation' },
  { keys: 'Mouse Wheel', action: 'Zoom', category: 'Navigation' },
  { keys: 'Arrow Keys', action: 'Move Selection', category: 'Navigation' },

  // Selection & Alignment
  { keys: 'Shift+Click', action: 'Add to Selection', category: 'Selection' },
  { keys: 'Ctrl+Click', action: 'Toggle Selection', category: 'Selection' },
  { keys: 'Drag Box', action: 'Box Select', category: 'Selection' },
];

const helpTopics: HelpTopic[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of creating your first blueprint',
    icon: 'play-circle-outline',
  },
  {
    id: 'nodes-pins',
    title: 'Nodes & Pins',
    description: 'Understand nodes, pins, and how to connect them',
    icon: 'connection',
  },
  {
    id: 'data-flow',
    title: 'Data Flow',
    description: 'Master data types and flow control in blueprints',
    icon: 'shuffle-variant',
  },
  {
    id: 'execution',
    title: 'Execution',
    description: 'Learn about blueprint execution and control flow',
    icon: 'play-outline',
  },
  {
    id: 'debugging',
    title: 'Debugging',
    description: 'Use breakpoints and the debug console effectively',
    icon: 'bug-outline',
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    description: 'Follow industry standards for blueprint design',
    icon: 'lightbulb-outline',
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description: 'Optimize your blueprints for performance',
    icon: 'speedometer',
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description: 'Work with others using version control and sharing',
    icon: 'account-multiple',
  },
];

export default function HelpAndShortcuts() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'help'>('shortcuts');
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  const filteredShortcuts = shortcuts.filter((shortcut) => {
    const matchesText =
      shortcut.action.toLowerCase().includes(filterText.toLowerCase()) ||
      shortcut.keys.toLowerCase().includes(filterText.toLowerCase());
    const matchesCategory = !selectedCategory || shortcut.category === selectedCategory;
    return matchesText && matchesCategory;
  });

  const renderShortcutsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={16} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shortcuts..."
            placeholderTextColor="#64748b"
            value={filterText}
            onChangeText={setFilterText}
          />
        </View>

        <ScrollView horizontal style={styles.categoryFilter}>
          <Pressable
            style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
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
              style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === cat && styles.categoryButtonTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.shortcutsList}>
        {filteredShortcuts.length > 0 ? (
          filteredShortcuts.map((shortcut, idx) => (
            <View key={idx} style={styles.shortcutItem}>
              <View style={styles.shortcutKeys}>
                {shortcut.keys.split('+').map((key, kidx) => (
                  <View key={kidx} style={styles.keyBadge}>
                    <Text style={styles.keyBadgeText}>{key}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.shortcutAction}>{shortcut.action}</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{shortcut.category}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="magnify-close" size={40} color="#64748b" />
            <Text style={styles.emptyText}>No shortcuts found</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Total shortcuts: {shortcuts.length}</Text>
      </View>
    </View>
  );

  const renderHelpTab = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.helpContent}>
        <View style={styles.helpGrid}>
          {helpTopics.map((topic) => (
            <Pressable key={topic.id} style={styles.helpCard}>
              <View style={styles.helpCardIcon}>
                <MaterialCommunityIcons name={topic.icon as any} size={28} color="#06b6d4" />
              </View>
              <Text style={styles.helpCardTitle}>{topic.title}</Text>
              <Text style={styles.helpCardDescription}>{topic.description}</Text>
              <View style={styles.helpCardFooter}>
                <Text style={styles.helpCardLink}>Learn more →</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Additional Help Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Resources</Text>

          <Pressable
            style={styles.resourceItem}
            onPress={() => console.log('Opening Documentation')}
          >
            <MaterialCommunityIcons name="book-open-outline" size={18} color="#06b6d4" />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>Documentation</Text>
              <Text style={styles.resourceDesc}>Complete API reference and guides</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#64748b" />
          </Pressable>

          <Pressable
            style={styles.resourceItem}
            onPress={() => console.log('Opening Video Tutorials')}
          >
            <MaterialCommunityIcons name="video-outline" size={18} color="#06b6d4" />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>Video Tutorials</Text>
              <Text style={styles.resourceDesc}>Learn by watching expert tutorials</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#64748b" />
          </Pressable>

          <Pressable
            style={styles.resourceItem}
            onPress={() => console.log('Opening Community Forum')}
          >
            <MaterialCommunityIcons name="forum-outline" size={18} color="#06b6d4" />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>Community Forum</Text>
              <Text style={styles.resourceDesc}>Ask questions and share knowledge</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#64748b" />
          </Pressable>

          <Pressable
            style={styles.resourceItem}
            onPress={() => console.log('Opening GitHub Examples')}
          >
            <MaterialCommunityIcons name="github" size={18} color="#06b6d4" />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>GitHub Examples</Text>
              <Text style={styles.resourceDesc}>Browse open-source blueprint examples</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#64748b" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="help-circle-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Help</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Help & Shortcuts</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {(['shortcuts', 'help'] as const).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <MaterialCommunityIcons
                  name={tab === 'shortcuts' ? 'keyboard' : 'help-circle'}
                  size={16}
                  color={activeTab === tab ? '#06b6d4' : '#64748b'}
                />
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === 'shortcuts' && renderShortcutsTab()}
          {activeTab === 'help' && renderHelpTab()}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#06b6d4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#06b6d4',
  },
  tabContent: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 12,
  },
  categoryFilter: {
    marginBottom: 0,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    marginRight: 6,
  },
  categoryButtonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  categoryButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryButtonTextActive: {
    color: '#06b6d4',
  },
  shortcutsList: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  shortcutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 12,
  },
  shortcutKeys: {
    flexDirection: 'row',
    gap: 4,
  },
  keyBadge: {
    backgroundColor: '#334155',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 32,
    alignItems: 'center',
  },
  keyBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  shortcutAction: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  categoryTag: {
    backgroundColor: '#0c4a6e',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  categoryTagText: {
    fontSize: 9,
    color: '#06b6d4',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  helpContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  helpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  helpCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  helpCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0c4a6e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  helpCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  helpCardDescription: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 8,
    lineHeight: 14,
  },
  helpCardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  helpCardLink: {
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: '600',
  },
  resourcesSection: {
    paddingVertical: 16,
  },
  resourcesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  resourceDesc: {
    fontSize: 10,
    color: '#94a3b8',
  },
});
