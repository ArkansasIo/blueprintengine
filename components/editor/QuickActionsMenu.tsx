import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Modal,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickActionsMenu: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { selectedNodes, deleteSelected, duplicateSelected } = useEditorStore();

  const actions: QuickAction[] = [
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'content-duplicate',
      color: '#3b82f6',
      onPress: () => {
        duplicateSelected();
        setShowMenu(false);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'delete',
      color: '#ef4444',
      onPress: () => {
        deleteSelected();
        setShowMenu(false);
      },
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: 'content-copy',
      color: '#06b6d4',
      onPress: () => {
        // Copy to clipboard
        setShowMenu(false);
      },
    },
    {
      id: 'comment',
      label: 'Comment',
      icon: 'comment-text',
      color: '#10b981',
      onPress: () => {
        // Add comment node
        setShowMenu(false);
      },
    },
  ];

  const availableActions = selectedNodes.length > 0 ? actions : [];

  return (
    <>
      {/* Quick Actions Button */}
      <Pressable
        style={styles.button}
        onPress={() => setShowMenu(!showMenu)}
      >
        <MaterialCommunityIcons
          name={showMenu ? 'close' : 'menu'}
          size={20}
          color={selectedNodes.length > 0 ? '#06b6d4' : '#cbd5e1'}
        />
      </Pressable>

      {/* Quick Actions Menu Modal */}
      {showMenu && (
        <Modal
          visible={showMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          {/* Backdrop */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setShowMenu(false)}
          />

          {/* Menu Panel */}
          <View style={styles.menuPanel}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Quick Actions</Text>
              <Pressable onPress={() => setShowMenu(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#cbd5e1"
                />
              </Pressable>
            </View>

            {availableActions.length > 0 ? (
              <ScrollView style={styles.actionsList}>
                {availableActions.map((action) => (
                  <Pressable
                    key={action.id}
                    style={styles.actionItem}
                    onPress={action.onPress}
                  >
                    <View
                      style={[
                        styles.actionIcon,
                        { backgroundColor: action.color + '20' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={action.icon}
                        size={16}
                        color={action.color}
                      />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color="#475569"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="cursor-default"
                  size={32}
                  color="#475569"
                />
                <Text style={styles.emptyText}>Select nodes to see actions</Text>
              </View>
            )}

            {/* Help Section */}
            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Keyboard Shortcuts</Text>
              <Text style={styles.helpText}>• D - Duplicate</Text>
              <Text style={styles.helpText}>• Delete - Remove</Text>
              <Text style={styles.helpText}>• Ctrl+C - Copy</Text>
              <Text style={styles.helpText}>• Ctrl+V - Paste</Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  menuPanel: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: 280,
    maxHeight: 400,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 100,
  },

  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },

  actionsList: {
    maxHeight: 250,
  },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.5)',
    gap: 12,
  },

  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionContent: {
    flex: 1,
  },

  actionLabel: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 8,
  },

  emptyText: {
    fontSize: 12,
    color: '#64748b',
  },

  helpSection: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0f172a',
  },

  helpTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  helpText: {
    fontSize: 9,
    color: '#64748b',
    marginVertical: 2,
  },
});

export default QuickActionsMenu;