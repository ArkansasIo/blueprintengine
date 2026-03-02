import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: 'Ctrl/Cmd + Z', description: 'Undo last action', category: 'History' },
  { keys: 'Ctrl/Cmd + Shift + Z', description: 'Redo action', category: 'History' },
  { keys: 'Delete/Backspace', description: 'Delete selected node or edge', category: 'Editing' },
  { keys: 'Ctrl/Cmd + D', description: 'Duplicate selected node', category: 'Editing' },
  { keys: 'Escape', description: 'Deselect all', category: 'Selection' },
  { keys: 'Shift + Drag', description: 'Pan without snapping', category: 'Navigation' },
];

export default function KeyboardShortcutsHelp() {
  const [visible, setVisible] = useState(false);

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="keyboard" size={20} color="#fff" />
        <Text style={styles.buttonText}>Help</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Keyboard Shortcuts</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <View key={category} style={styles.section}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {categoryShortcuts.map((shortcut, idx) => (
                  <View key={idx} style={styles.shortcutRow}>
                    <View style={styles.keysContainer}>
                      {shortcut.keys.split('/').map((key, i) => (
                        <View key={i}>
                          <View style={styles.keyBadge}>
                            <Text style={styles.keyText}>{key.trim()}</Text>
                          </View>
                          {i < shortcut.keys.split('/').length - 1 && (
                            <Text style={styles.orText}>or</Text>
                          )}
                        </View>
                      ))}
                    </View>
                    <Text style={styles.description}>{shortcut.description}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Tips Section */}
            <View style={styles.section}>
              <Text style={styles.categoryTitle}>Tips & Tricks</Text>
              <View style={styles.tipCard}>
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={20}
                  color="#f59e0b"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Drag to Pan</Text>
                  <Text style={styles.tipText}>
                    Click and drag on empty canvas to pan around
                  </Text>
                </View>
              </View>

              <View style={styles.tipCard}>
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={20}
                  color="#f59e0b"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Snap to Grid</Text>
                  <Text style={styles.tipText}>
                    Nodes automatically snap to 8px grid for alignment
                  </Text>
                </View>
              </View>

              <View style={styles.tipCard}>
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={20}
                  color="#f59e0b"
                />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Type Safety</Text>
                  <Text style={styles.tipText}>
                    Only compatible pin types can connect together
                  </Text>
                </View>
              </View>
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
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  keysContainer: {
    minWidth: 140,
    marginRight: 16,
  },
  keyBadge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 4,
  },
  keyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
    fontFamily: 'monospace',
  },
  orText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 4,
  },
  description: {
    flex: 1,
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 4,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
