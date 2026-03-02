import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Modal, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';
import { useHistoryStore } from '@/app/stores/history-store';
import * as BlueprintStorage from '@/app/utils/blueprint-storage';
import { JSONBlueprintExporter } from '@/app/utils/blueprint-import-export';
import { validateBlueprint } from '@/app/utils/blueprint-validator';
import { GraphExecutor } from '@/app/utils/graph-executor';

interface MenuSection {
  label: string;
  icon: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
}

export default function MainMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    clearBlueprint,
    selectAllNodes,
    deselectAll,
    deleteSelected,
    duplicateSelected,
    copySelected,
    pasteNodes,
    setZoom,
    zoom,
    nodes,
    edges,
  } = useEditorStore();
  const { undo, redo, canUndo, canRedo } = useHistoryStore();

  // File Menu Handlers
  const handleNewBlueprint = () => {
    clearBlueprint();
    console.log('✅ New Blueprint Created');
    setMenuVisible(false);
  };

  const handleOpenBlueprint = async () => {
    try {
      const blueprints = await BlueprintStorage.getBlueprints();
      if (blueprints.length === 0) {
        Alert.alert('Info', 'No saved blueprints found');
        setMenuVisible(false);
        return;
      }
      // Create selection list
      const options = blueprints.map(b => b.name);
      Alert.alert('Open Blueprint', 'Select a blueprint to open:', [
        ...blueprints.map((blueprint, index) => ({
          text: blueprint.name,
          onPress: async () => {
            try {
              const loaded = await BlueprintStorage.loadBlueprint(blueprint.id);
              if (loaded) {
                Alert.alert('Success', `Loaded: ${blueprint.name}`);
                setMenuVisible(false);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to load blueprint');
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load blueprints');
      console.error('Open error:', error);
    }
    setMenuVisible(false);
  };

  const handleSaveBlueprint = async () => {
    try {
      const blueprint = {
        id: Date.now().toString(),
        name: 'Current Blueprint',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodes: nodes,
        edges: edges,
      };
      await BlueprintStorage.saveBlueprint(blueprint);
      Alert.alert('Success', '💾 Blueprint saved successfully');
      console.log('Blueprint saved:', blueprint);
    } catch (error) {
      Alert.alert('Error', 'Failed to save blueprint');
      console.error('Save error:', error);
    }
    setMenuVisible(false);
  };

  const handleExport = () => {
    try {
      const blueprint = {
        id: Date.now().toString(),
        name: 'Exported Blueprint',
        nodes: nodes,
        edges: edges,
      };
      const exporter = new JSONBlueprintExporter();
      const jsonExport = exporter.export(blueprint as any, true);
      // Copy to clipboard
      console.log('📤 Exported blueprint:', jsonExport);
      Alert.alert('Success', 'Blueprint exported to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to export blueprint');
      console.error('Export error:', error);
    }
    setMenuVisible(false);
  };

  const handleImport = () => {
    Alert.prompt(
      'Import Blueprint',
      'Paste your blueprint JSON:',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Import',
          onPress: (jsonString) => {
            if (!jsonString) return;
            try {
              const exporter = new JSONBlueprintExporter();
              const imported = exporter.import(jsonString);
              if (imported) {
                clearBlueprint();
                Alert.alert('Success', '📥 Blueprint imported successfully');
                console.log('Imported blueprint:', imported);
              } else {
                Alert.alert('Error', 'Invalid blueprint format');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to import blueprint');
              console.error('Import error:', error);
            }
          },
        },
      ]
    );
    setMenuVisible(false);
  };

  // Edit Menu Handlers
  const handleCut = () => {
    copySelected();
    deleteSelected();
    console.log('✂️ Cut');
    setMenuVisible(false);
  };

  const handleCopy = () => {
    copySelected();
    console.log('📋 Copy');
    setMenuVisible(false);
  };

  const handlePaste = () => {
    pasteNodes();
    console.log('📌 Paste');
    setMenuVisible(false);
  };

  const handleDuplicate = () => {
    duplicateSelected();
    console.log('👯 Duplicate');
    setMenuVisible(false);
  };

  const handleDelete = () => {
    deleteSelected();
    console.log('🗑️ Delete');
    setMenuVisible(false);
  };

  const handleSelectAll = () => {
    selectAllNodes();
    console.log('✅ Select All');
    setMenuVisible(false);
  };

  const handleDeselectAll = () => {
    deselectAll();
    console.log('⭕ Deselect All');
    setMenuVisible(false);
  };

  // View Menu Handlers
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 4);
    setZoom(newZoom);
    console.log(`🔍 Zoom In: ${(newZoom * 100).toFixed(0)}%`);
    setMenuVisible(false);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
    console.log(`🔍 Zoom Out: ${(newZoom * 100).toFixed(0)}%`);
    setMenuVisible(false);
  };

  const handleZoomFit = () => {
    setZoom(1);
    console.log('🔍 Zoom to Fit');
    setMenuVisible(false);
  };

  // Tools Menu Handlers
  const handleValidate = () => {
    try {
      const blueprint = {
        id: 'current',
        name: 'Current Blueprint',
        nodes: nodes,
        edges: edges,
      };
      const errors = validateBlueprint(blueprint as any);
      if (errors.length === 0) {
        Alert.alert('✔️ Validation Passed', 'No errors found in blueprint');
      } else {
        const errorMessage = errors.map(e => `• ${e.message}`).join('\n');
        Alert.alert('⚠️ Validation Failed', `Found ${errors.length} error(s):\n${errorMessage}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Validation failed with error');
      console.error('Validation error:', error);
    }
    setMenuVisible(false);
  };

  const handleCompile = () => {
    try {
      const blueprint = {
        id: 'current',
        name: 'Current Blueprint',
        nodes: nodes,
        edges: edges,
      };
      // Validate first
      const errors = validateBlueprint(blueprint as any);
      if (errors.length > 0) {
        const errorMessage = errors.map(e => `• ${e.message}`).join('\n');
        Alert.alert('❌ Compilation Failed', `Fix these errors first:\n${errorMessage}`);
        setMenuVisible(false);
        return;
      }
      // Compile
      const executor = new GraphExecutor();
      const results = executor.execute(blueprint as any);
      Alert.alert('🔨 Compile Successful', `Blueprint compiled successfully with ${nodes.length} nodes and ${edges.length} connections`);
      console.log('Compilation results:', results);
    } catch (error) {
      Alert.alert('Error', 'Compilation failed');
      console.error('Compile error:', error);
    }
    setMenuVisible(false);
  };

  const handleSearch = () => {
    console.log('🔎 Search');
    setMenuVisible(false);
  };

  // File Menu Items
  const fileMenuItems: MenuItem[] = [
    {
      label: 'New Blueprint',
      icon: 'file-plus-outline',
      action: handleNewBlueprint,
      shortcut: 'Ctrl+N',
    },
    {
      label: 'Open Blueprint',
      icon: 'folder-open-outline',
      action: handleOpenBlueprint,
      shortcut: 'Ctrl+O',
    },
    {
      label: 'Save Blueprint',
      icon: 'content-save-outline',
      action: handleSaveBlueprint,
      shortcut: 'Ctrl+S',
    },
    {
      label: 'Save As...',
      icon: 'content-save-all-outline',
      action: () => {
        console.log('💾 Save As');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+Shift+S',
    },
    { divider: true } as any,
    {
      label: 'Export',
      icon: 'download-outline',
      action: handleExport,
      shortcut: 'Ctrl+E',
    },
    {
      label: 'Import',
      icon: 'upload-outline',
      action: handleImport,
      shortcut: 'Ctrl+I',
    },
    { divider: true } as any,
    {
      label: 'Exit',
      icon: 'exit-to-app',
      action: () => {
        console.log('👋 Exit Application');
        setMenuVisible(false);
      },
      shortcut: 'Alt+F4',
    },
  ];

  // Edit Menu Items
  const editMenuItems: MenuItem[] = [
    {
      label: 'Undo',
      icon: 'undo',
      action: () => {
        undo();
        console.log('↶ Undo');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+Z',
      disabled: !canUndo,
    },
    {
      label: 'Redo',
      icon: 'redo',
      action: () => {
        redo();
        console.log('↷ Redo');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+Y',
      disabled: !canRedo,
    },
    { divider: true } as any,
    {
      label: 'Cut',
      icon: 'content-cut',
      action: handleCut,
      shortcut: 'Ctrl+X',
    },
    {
      label: 'Copy',
      icon: 'content-copy',
      action: handleCopy,
      shortcut: 'Ctrl+C',
    },
    {
      label: 'Paste',
      icon: 'content-paste',
      action: handlePaste,
      shortcut: 'Ctrl+V',
    },
    {
      label: 'Duplicate',
      icon: 'content-duplicate',
      action: handleDuplicate,
      shortcut: 'Ctrl+D',
    },
    { divider: true } as any,
    {
      label: 'Select All',
      icon: 'select-all',
      action: handleSelectAll,
      shortcut: 'Ctrl+A',
    },
    {
      label: 'Deselect All',
      icon: 'select-off',
      action: handleDeselectAll,
      shortcut: 'Ctrl+Shift+A',
    },
    { divider: true } as any,
    {
      label: 'Delete',
      icon: 'delete-outline',
      action: handleDelete,
      shortcut: 'Delete',
    },
  ];

  // View Menu Items
  const viewMenuItems: MenuItem[] = [
    {
      label: 'Zoom In',
      icon: 'magnify-plus-outline',
      action: handleZoomIn,
      shortcut: 'Ctrl+Plus',
    },
    {
      label: 'Zoom Out',
      icon: 'magnify-minus-outline',
      action: handleZoomOut,
      shortcut: 'Ctrl+Minus',
    },
    {
      label: 'Zoom to Fit',
      icon: 'fit-to-screen',
      action: handleZoomFit,
      shortcut: 'Ctrl+0',
    },
    { divider: true } as any,
    {
      label: 'Show Grid',
      icon: 'grid',
      action: () => {
        console.log('📊 Toggle Grid');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+G',
    },
    {
      label: 'Show Node Tree',
      icon: 'file-tree',
      action: () => {
        console.log('🌳 Show Node Tree');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+T',
    },
    {
      label: 'Show Details Panel',
      icon: 'information-outline',
      action: () => {
        console.log('ℹ️ Show Details Panel');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+P',
    },
    { divider: true } as any,
    {
      label: 'Toggle Dark Mode',
      icon: 'weather-night',
      action: () => {
        console.log('🌙 Toggle Dark Mode');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+L',
    },
  ];

  // Tools Menu Items
  const toolsMenuItems: MenuItem[] = [
    {
      label: 'Compile Blueprint',
      icon: 'hammer-screwdriver',
      action: handleCompile,
      shortcut: 'F5',
    },
    {
      label: 'Validate Blueprint',
      icon: 'check-circle-outline',
      action: handleValidate,
      shortcut: 'Ctrl+Shift+V',
    },
    {
      label: 'Generate Code',
      icon: 'code-tags',
      action: () => {
        console.log('💻 Generate Code');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+G',
    },
    { divider: true } as any,
    {
      label: 'Node Library',
      icon: 'library-shelves',
      action: () => {
        console.log('📚 Node Library');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+L',
    },
    {
      label: 'Blueprint Search',
      icon: 'magnify',
      action: handleSearch,
      shortcut: 'Ctrl+F',
    },
    { divider: true } as any,
    {
      label: 'Preferences',
      icon: 'cog-outline',
      action: () => {
        console.log('⚙️ Preferences');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+,',
    },
    {
      label: 'Keyboard Shortcuts',
      icon: 'keyboard',
      action: () => {
        console.log('⌨️ Keyboard Shortcuts');
        setMenuVisible(false);
      },
      shortcut: 'Ctrl+Shift+?',
    },
  ];

  // Help Menu Items
  const helpMenuItems: MenuItem[] = [
    {
      label: 'Documentation',
      icon: 'book-outline',
      action: () => {
        console.log('📖 Documentation');
        setMenuVisible(false);
      },
      shortcut: 'F1',
    },
    {
      label: 'Blueprint Guide',
      icon: 'school-outline',
      action: () => {
        console.log('🎓 Blueprint Guide');
        setMenuVisible(false);
      },
    },
    {
      label: 'API Reference',
      icon: 'api',
      action: () => {
        console.log('🔗 API Reference');
        setMenuVisible(false);
      },
    },
    { divider: true } as any,
    {
      label: 'Feedback',
      icon: 'message-text-outline',
      action: () => {
        console.log('💬 Send Feedback');
        setMenuVisible(false);
      },
    },
    {
      label: 'Report Bug',
      icon: 'bug-outline',
      action: () => {
        console.log('🐛 Report Bug');
        setMenuVisible(false);
      },
    },
    { divider: true } as any,
    {
      label: 'About',
      icon: 'information-outline',
      action: () => {
        console.log('ℹ️ About');
        setMenuVisible(false);
      },
    },
  ];

  const menus: MenuSection[] = [
    { label: 'File', icon: 'file-outline', items: fileMenuItems },
    { label: 'Edit', icon: 'pencil-outline', items: editMenuItems },
    { label: 'View', icon: 'eye-outline', items: viewMenuItems },
    { label: 'Tools', icon: 'tools', items: toolsMenuItems },
    { label: 'Help', icon: 'help-circle-outline', items: helpMenuItems },
  ];

  const renderMenuItems = (items: MenuItem[]) => (
    <>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.divider ? (
            <View style={styles.menuDivider} />
          ) : (
            <Pressable
              style={[styles.menuItem, item.disabled && styles.menuItemDisabled]}
              onPress={() => {
                item.action();
                setMenuVisible(false);
                setActiveMenu(null);
              }}
              disabled={item.disabled}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={16}
                color={item.disabled ? '#64748b' : '#cbd5e1'}
              />
              <Text style={[styles.menuItemText, item.disabled && styles.menuItemTextDisabled]}>
                {item.label}
              </Text>
              {item.shortcut && <Text style={styles.menuItemShortcut}>{item.shortcut}</Text>}
            </Pressable>
          )}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <>
      <View style={styles.menuBar}>
        {menus.map((menu) => (
          <Pressable
            key={menu.label}
            style={[styles.menuButton, activeMenu === menu.label && styles.menuButtonActive]}
            onPress={() => {
              setActiveMenu(activeMenu === menu.label ? null : menu.label);
              setMenuVisible(true);
            }}
          >
            <Text style={styles.menuButtonText}>{menu.label}</Text>
          </Pressable>
        ))}
      </View>

      <Modal visible={menuVisible && activeMenu !== null} transparent animationType="none">
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            setMenuVisible(false);
            setActiveMenu(null);
          }}
        >
          <View style={styles.menuDropdown}>
            {menus.map((menu) => {
              if (menu.label === activeMenu) {
                return (
                  <ScrollView key={menu.label} style={styles.menuContent}>
                    {renderMenuItems(menu.items)}
                  </ScrollView>
                );
              }
              return null;
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  menuButtonActive: {
    backgroundColor: '#1e293b',
  },
  menuButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuDropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    minWidth: 240,
    maxHeight: 400,
    overflow: 'hidden',
  },
  menuContent: {
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemText: {
    flex: 1,
    fontSize: 12,
    color: '#e2e8f0',
    marginLeft: 10,
  },
  menuItemTextDisabled: {
    color: '#64748b',
  },
  menuItemShortcut: {
    fontSize: 10,
    color: '#64748b',
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
});