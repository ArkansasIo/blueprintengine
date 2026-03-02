import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { EditorNode, NodeType } from '../../app/types/editor';
import { nanoid } from '../../app/utils/id-generator';
import NodeLibraryPanel from './NodeLibraryPanel';
import EditorInspector from './EditorInspector';
import NodePropertyEditor from './NodePropertyEditor';
import SaveExportButton from './SaveExportButton';
import ExecutionVisualizer from './ExecutionVisualizer';
import TemplateLibrary from './TemplateLibrary';
import UndoRedoControls from './UndoRedoControls';
import NodeComments from './NodeComments';
import BlueprintSharing from './BlueprintSharing';
import NodeSearch from './NodeSearch';
import BlueprintAnalytics from './BlueprintAnalytics';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import BookmarksManager from './BookmarksManager';
import CustomTemplatesManager from './CustomTemplatesManager';
import ChangelogViewer from './ChangelogViewer';
import AlignmentTools from './AlignmentTools';
import FavoritesPanel from './FavoritesPanel';
import PerformanceMonitor from './PerformanceMonitor';
import BatchOperationsPanel from './BatchOperationsPanel';
import DebugMode from './DebugMode';
import LayoutManager from './LayoutManager';
import DiffViewer from './DiffViewer';
import NodeGrouping from './NodeGrouping';
import AdvancedExport from './AdvancedExport';
import ConnectionPresets from './ConnectionPresets';
import SmartTemplateGenerator from './SmartTemplateGenerator';
import AINodeSuggester from './AINodeSuggester';
import CollaborationPanel from './CollaborationPanel';
import AIBlueprintChat from './AIBlueprintChat';

export default function EditorToolbar() {
  const { addNode, clearBlueprint } = useEditorStore();

  const nodeTemplates: Array<{
    type: NodeType;
    label: string;
    color: string;
  }> = [
    { type: 'input', label: 'Input', color: '#3b82f6' },
    { type: 'output', label: 'Output', color: '#10b981' },
    { type: 'logic', label: 'Logic', color: '#f59e0b' },
    { type: 'condition', label: 'If', color: '#ef4444' },
    { type: 'action', label: 'Action', color: '#8b5cf6' },
  ];

  const handleAddNode = (type: NodeType, label: string) => {
    const newNode: EditorNode = {
      id: nanoid(),
      type,
      label,
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      pins: [
        {
          id: nanoid(),
          label: 'In',
          type: 'input',
          dataType: 'exec',
        },
        {
          id: nanoid(),
          label: 'Out',
          type: 'output',
          dataType: 'exec',
        },
      ],
      color: label,
    };
    addNode(newNode);
  };

  return (
    <View style={styles.toolbar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <UndoRedoControls />
        <NodeSearch />
        <BlueprintAnalytics />
        {nodeTemplates.map((template) => (
          <Pressable
            key={template.type}
            style={[styles.button, { borderColor: template.color }]}
            onPress={() => handleAddNode(template.type, template.label)}
          >
            <Text style={styles.buttonText}>{template.label}</Text>
          </Pressable>
        ))}
        <NodePropertyEditor />
        <NodeComments />
        <ExecutionVisualizer />
        <ChangelogViewer />
        <AlignmentTools />
        <FavoritesPanel />
        <PerformanceMonitor />
        <BatchOperationsPanel />
        <DebugMode />
        <LayoutManager />
        <DiffViewer />
        <NodeGrouping />
        <AdvancedExport />
        <ConnectionPresets />
        <SmartTemplateGenerator />
        <AINodeSuggester />
        <CollaborationPanel />
        <AIBlueprintChat />
        <BlueprintSharing />
        <BookmarksManager />
        <CustomTemplatesManager />
        <TemplateLibrary />
        <NodeLibraryPanel />
        <EditorInspector />
        <SaveExportButton />
        <KeyboardShortcutsHelp />
        <Pressable
          style={[styles.button, styles.clearButton]}
          onPress={clearBlueprint}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    borderColor: '#ef4444',
  },
});