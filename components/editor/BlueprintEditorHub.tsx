import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlueprintClass } from '@/app/utils/ue5-blueprint-generator';
import BlueprintVisualEditor, { IBlueprintEditor } from './BlueprintVisualEditor';
import AIBlueprintChat from './AIBlueprintChat';
import UndoRedoControls from './UndoRedoControls';
import MainMenu from './MainMenu';
import CompilationPanel from './CompilationPanel';
import PreferencesPanel from './PreferencesPanel';
import NodeConfigurationPanel from './NodeConfigurationPanel';
import DebugConsole from './DebugConsole';
import GraphExecutionVisualizer from './GraphExecutionVisualizer';
import VersionControlPanel from './VersionControlPanel';
import ToolsPanel from './ToolsPanel';
import HelpAndShortcuts from './HelpAndShortcuts';
import NodeLibraryBrowser from './NodeLibraryBrowser';
import SearchReplacePanel from './SearchReplacePanel';
import BlueprintInspector from './BlueprintInspector';
import MiniMapView from './MiniMapView';
import PerformanceMonitorPanel from './PerformanceMonitorPanel';
import BlueprintAnalyticsPanel from './BlueprintAnalyticsPanel';

interface BlueprintEditorHubProps {
  blueprint: BlueprintClass | null;
  onBlueprintChange: (blueprint: BlueprintClass) => void;
  onCompile?: (blueprint: BlueprintClass) => Promise<boolean>;
}

const BlueprintEditorHub: React.FC<BlueprintEditorHubProps> = ({
  blueprint,
  onBlueprintChange,
  onCompile,
}) => {
  const editorRef = useRef<IBlueprintEditor>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * UE5 API: Compile the blueprint
   */
  const handleCompile = useCallback(async () => {
    try {
      if (onCompile) {
        const success = await onCompile(blueprint!);
        if (success) {
          Alert.alert('Success', 'Blueprint compiled successfully!');
        } else {
          Alert.alert('Error', 'Blueprint compilation failed. Check the error log.');
        }
      }
    } catch (error) {
      Alert.alert('Error', `Compilation error: ${error}`);
    }
  }, [blueprint, onCompile]);

  /**
   * UE5 API: Save blueprint
   */
  const handleSave = useCallback(async () => {
    if (!blueprint) return;

    setIsSaving(true);
    try {
      // Save logic here
      await new Promise((resolve) => setTimeout(resolve, 500));
      Alert.alert('Success', `Blueprint "${blueprint.name}" saved!`);
    } catch (error) {
      Alert.alert('Error', `Failed to save: ${error}`);
    } finally {
      setIsSaving(false);
    }
  }, [blueprint]);

  /**
   * UE5 API: Delete selected nodes
   */
  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = editorRef.current?.GetSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      Alert.alert(
        'Delete Nodes',
        `Delete ${selectedNodes.length} selected node(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => editorRef.current?.DeleteSelected(),
          },
        ]
      );
    } else {
      Alert.alert('Info', 'Select nodes to delete');
    }
  }, []);

  /**
   * UE5 API: Duplicate selected nodes
   */
  const handleDuplicate = useCallback(() => {
    const selectedNodes = editorRef.current?.GetSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
      editorRef.current?.DuplicateSelected();
    } else {
      Alert.alert('Info', 'Select nodes to duplicate');
    }
  }, []);

  /**
   * UE5 API: Zoom to fit all nodes
   */
  const handleZoomToFit = useCallback(() => {
    editorRef.current?.ZoomToFit();
  }, []);

  /**
   * UE5 API: Reset view
   */
  const handleResetView = useCallback(() => {
    editorRef.current?.SetZoom(1);
    editorRef.current?.Pan(-editorRef.current.getState?.()?.panX || 0, -editorRef.current.getState?.()?.panY || 0);
  }, []);

  return (
    <View style={styles.container}>
      {/* Main Menu Bar */}
      <MainMenu />

      {/* Top Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionGroup}>
          <Pressable
            style={styles.actionButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <MaterialCommunityIcons name="content-save" size={18} color="#06b6d4" />
            <Text style={styles.actionButtonText}>Save</Text>
          </Pressable>

          <CompilationPanel />

          <View style={styles.separator} />

          <Pressable style={styles.actionButton} onPress={handleDuplicate}>
            <MaterialCommunityIcons name="content-duplicate" size={18} color="#06b6d4" />
            <Text style={styles.actionButtonText}>Duplicate</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleDeleteSelected}>
            <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </Pressable>
        </View>

        <View style={styles.actionGroup}>
          <UndoRedoControls />

          <View style={styles.separator} />

          <Pressable style={styles.actionButton} onPress={handleZoomToFit}>
            <MaterialCommunityIcons name="fit-to-screen" size={18} color="#06b6d4" />
            <Text style={styles.actionButtonText}>Fit</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleResetView}>
            <MaterialCommunityIcons name="refresh" size={18} color="#06b6d4" />
            <Text style={styles.actionButtonText}>Reset</Text>
          </Pressable>

          <View style={styles.separator} />

          <NodeLibraryBrowser />

          <PreferencesPanel />

          <ToolsPanel />

          <VersionControlPanel />

          <HelpAndShortcuts />

          <SearchReplacePanel />

          <View style={styles.separator} />

          <Pressable
            style={styles.actionButton}
            onPress={() => setShowAIChat(!showAIChat)}
          >
            <MaterialCommunityIcons name="robot" size={18} color="#06b6d4" />
            <Text style={styles.actionButtonText}>AI Chat</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Editor */}
      <View style={styles.editorContainer}>
        <BlueprintVisualEditor
          ref={editorRef}
          blueprint={blueprint}
        />

        {/* AI Chat Overlay */}
        {showAIChat && (
          <View style={styles.aiChatOverlay}>
            <View style={styles.aiChatContent}>
              <AIBlueprintChat />
              <Pressable
                style={styles.closeAIChat}
                onPress={() => setShowAIChat(false)}
              >
                <MaterialCommunityIcons name="close" size={20} color="#cbd5e1" />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {blueprint?.name || 'Untitled Blueprint'}
        </Text>
        <View style={styles.statusRight}>
          <Text style={styles.statusInfo}>
            {blueprint?.eventGraphNodes.length || 0} nodes • {blueprint?.eventGraphEdges.length || 0} connections
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    minHeight: 48,
  },

  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },

  actionButtonText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },

  editorContainer: {
    flex: 1,
    position: 'relative',
  },

  aiChatOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 400,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
  },

  aiChatContent: {
    flex: 1,
    position: 'relative',
  },

  closeAIChat: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
  },

  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#0f172a',
    minHeight: 32,
  },

  statusText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  statusInfo: {
    fontSize: 10,
    color: '#64748b',
  },
});

export default BlueprintEditorHub;