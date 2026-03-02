import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { menuHandler, MenuActionContext } from '@/app/utils/menu-handlers';

interface WebEditorLayoutProps {
  children?: React.ReactNode;
  onNewBlueprint?: () => void;
  onOpenBlueprint?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomFit?: () => void;
  onCompile?: () => void;
}

/**
 * Web Editor Layout
 * Professional layout for web-based blueprint editor
 */
export default function WebEditorLayout({
  children,
  onNewBlueprint,
  onOpenBlueprint,
  onSave,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onCompile,
}: WebEditorLayoutProps) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [currentBlueprint, setCurrentBlueprint] = useState('Untitled Blueprint');

  // Set up menu handler context
  React.useEffect(() => {
    const context: MenuActionContext = {
      onNewBlueprint,
      onOpenBlueprint,
      onSaveBlueprint: onSave,
      onUndo,
      onRedo,
      onCut,
      onCopy,
      onPaste,
      onDelete,
      onZoomIn,
      onZoomOut,
      onZoomFit,
      onCompile,
    };
    menuHandler.setContext(context);
  }, [
    onNewBlueprint,
    onOpenBlueprint,
    onSave,
    onUndo,
    onRedo,
    onCut,
    onCopy,
    onPaste,
    onDelete,
    onZoomIn,
    onZoomOut,
    onZoomFit,
    onCompile,
  ]);

  return (
    <View style={styles.container}>
      {/* Top Menu Bar */}
      <View style={styles.menuBar}>
        <View style={styles.menuLeft}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="cube" size={24} color="#06b6d4" />
            <Text style={styles.logoText}>Blueprint</Text>
          </View>

          <View style={styles.menuItems}>
            <Pressable
              style={styles.menuItem}
              onPress={() => menuHandler.handleMenuAction('file_menu')}
            >
              <Text style={styles.menuItemText}>File</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => menuHandler.handleMenuAction('edit_menu')}
            >
              <Text style={styles.menuItemText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => menuHandler.handleMenuAction('view_menu')}
            >
              <Text style={styles.menuItemText}>View</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => menuHandler.handleMenuAction('tools_menu')}
            >
              <Text style={styles.menuItemText}>Tools</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => menuHandler.handleMenuAction('help_menu')}
            >
              <Text style={styles.menuItemText}>Help</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.menuCenter}>
          <Text style={styles.blueprintTitle}>{currentBlueprint}</Text>
        </View>

        <View style={styles.menuRight}>
          <Pressable style={styles.iconButton} onPress={onNewBlueprint}>
            <MaterialCommunityIcons name="plus" size={20} color="#e2e8f0" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onOpenBlueprint}>
            <MaterialCommunityIcons name="folder-open" size={20} color="#e2e8f0" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onSave}>
            <MaterialCommunityIcons name="content-save" size={20} color="#e2e8f0" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.iconButton}
            onPress={() => menuHandler.handleMenuAction('user_menu')}
          >
            <MaterialCommunityIcons name="account-circle" size={24} color="#06b6d4" />
          </Pressable>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarGroup}>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleUndo}
            title="Undo"
          >
            <MaterialCommunityIcons name="undo" size={18} color="#e2e8f0" />
          </Pressable>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleRedo}
            title="Redo"
          >
            <MaterialCommunityIcons name="redo" size={18} color="#e2e8f0" />
          </Pressable>
        </View>

        <View style={styles.toolbarDivider} />

        <View style={styles.toolbarGroup}>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleCut}
            title="Cut"
          >
            <MaterialCommunityIcons name="content-cut" size={18} color="#e2e8f0" />
          </Pressable>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleCopy}
            title="Copy"
          >
            <MaterialCommunityIcons name="content-copy" size={18} color="#e2e8f0" />
          </Pressable>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handlePaste}
            title="Paste"
          >
            <MaterialCommunityIcons name="content-paste" size={18} color="#e2e8f0" />
          </Pressable>
        </View>

        <View style={styles.toolbarDivider} />

        <View style={styles.toolbarGroup}>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleZoomIn}
            title="Zoom In"
          >
            <MaterialCommunityIcons
              name="magnify-plus"
              size={18}
              color="#e2e8f0"
            />
          </Pressable>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleZoomOut}
            title="Zoom Out"
          >
            <MaterialCommunityIcons
              name="magnify-minus"
              size={18}
              color="#e2e8f0"
            />
          </Pressable>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleZoomFit}
            title="Zoom to Fit"
          >
            <MaterialCommunityIcons
              name="fit-to-screen"
              size={18}
              color="#e2e8f0"
            />
          </Pressable>
        </View>

        <View style={styles.toolbarDivider} />

        <View style={styles.toolbarGroup}>
          <Pressable
            style={[styles.toolButton, styles.compileButton]}
            onPress={menuHandler.handleCompile}
            title="Compile Blueprint"
          >
            <MaterialCommunityIcons name="wrench" size={18} color="#fff" />
            <Text style={styles.compileButtonText}>Compile</Text>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.toolbarGroup}>
          <Pressable
            style={styles.toolButton}
            onPress={menuHandler.handleShowHelp}
            title="Help"
          >
            <MaterialCommunityIcons name="help-circle" size={18} color="#e2e8f0" />
          </Pressable>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {/* Left Panel */}
        <View
          style={[
            styles.leftPanel,
            !leftPanelOpen && styles.leftPanelCollapsed,
          ]}
        >
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Node Library</Text>
            <Pressable onPress={() => setLeftPanelOpen(!leftPanelOpen)}>
              <MaterialCommunityIcons
                name={leftPanelOpen ? 'chevron-left' : 'chevron-right'}
                size={20}
                color="#e2e8f0"
              />
            </Pressable>
          </View>

          {leftPanelOpen && (
            <ScrollView style={styles.panelContent}>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons name="magnify" size={18} color="#64748b" />
                <Text style={styles.searchPlaceholder}>Search nodes...</Text>
              </View>

              {nodeLibraryCategories.map((category) => (
                <View key={category.id} style={styles.libraryCategory}>
                  <View style={styles.categoryHeader}>
                    <MaterialCommunityIcons
                      name={category.icon as any}
                      size={16}
                      color={category.color}
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryCount}>({category.items})</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Canvas Area */}
        <View style={styles.canvasArea}>{children}</View>

        {/* Right Panel */}
        <View
          style={[
            styles.rightPanel,
            !rightPanelOpen && styles.rightPanelCollapsed,
          ]}
        >
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Inspector</Text>
            <Pressable onPress={() => setRightPanelOpen(!rightPanelOpen)}>
              <MaterialCommunityIcons
                name={rightPanelOpen ? 'chevron-right' : 'chevron-left'}
                size={20}
                color="#e2e8f0"
              />
            </Pressable>
          </View>

          {rightPanelOpen && (
            <ScrollView style={styles.panelContent}>
              <View style={styles.inspectorSection}>
                <Text style={styles.inspectorTitle}>Properties</Text>
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="select"
                    size={32}
                    color="#334155"
                  />
                  <Text style={styles.emptyStateText}>
                    Select a node to view properties
                  </Text>
                </View>
              </View>

              <View style={styles.inspectorSection}>
                <Text style={styles.inspectorTitle}>Details</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Node Type</Text>
                  <Text style={styles.detailValue}>Branch</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Position</Text>
                  <Text style={styles.detailValue}>X: 100, Y: 200</Text>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusText}>Ready</Text>
        </View>
        <View style={styles.statusCenter}>
          <Text style={styles.statusText}>Zoom: 100%</Text>
        </View>
        <View style={styles.statusRight}>
          <Text style={styles.statusText}>FPS: 60</Text>
        </View>
      </View>
    </View>
  );
}

const nodeLibraryCategories = [
  { id: 'control', name: 'Control Flow', items: 5, icon: 'call-split', color: '#3b82f6' },
  { id: 'data', name: 'Data', items: 4, icon: 'database', color: '#06b6d4' },
  { id: 'events', name: 'Events', items: 4, icon: 'bell', color: '#f59e0b' },
  { id: 'functions', name: 'Functions', items: 3, icon: 'function', color: '#8b5cf6' },
  { id: 'math', name: 'Math', items: 5, icon: 'plus', color: '#10b981' },
  { id: 'logic', name: 'Logic', items: 7, icon: 'plus-circle', color: '#ec4899' },
  { id: 'string', name: 'String', items: 4, icon: 'format-text', color: '#14b8a6' },
  { id: 'array', name: 'Array', items: 5, icon: 'format-list-numbered', color: '#a855f7' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  menuBar: {
    height: 60,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flex: 1,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  menuItems: {
    flexDirection: 'row',
    gap: 8,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuItemText: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  menuCenter: {
    flex: 1,
    alignItems: 'center',
  },
  blueprintTitle: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  toolbar: {
    height: 50,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  toolbarGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  toolButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toolbarDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  compileButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  compileButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: 280,
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    flexDirection: 'column',
  },
  leftPanelCollapsed: {
    width: 0,
  },
  rightPanel: {
    width: 320,
    backgroundColor: '#1e293b',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    flexDirection: 'column',
  },
  rightPanelCollapsed: {
    width: 0,
  },
  panelHeader: {
    height: 44,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  panelContent: {
    flex: 1,
    padding: 12,
  },
  canvasArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchBox: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 12,
    color: '#64748b',
  },
  libraryCategory: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  categoryCount: {
    fontSize: 11,
    color: '#64748b',
  },
  inspectorSection: {
    marginBottom: 16,
  },
  inspectorTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  detailItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  statusBar: {
    height: 32,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  statusLeft: {
    flex: 1,
  },
  statusCenter: {
    flex: 1,
    alignItems: 'center',
  },
  statusRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 11,
    color: '#64748b',
  },
});