import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  PanResponder,
  GestureResponderEvent,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlueprintClass, BlueprintNode, BlueprintEdge, PinType } from '@/app/utils/ue5-blueprint-generator';
import EditorCanvas from './EditorCanvas';
import DetailsPanel from './DetailsPanel';
import PallettePanel from './PallettePanel';
import CompileStatusBar from './CompileStatusBar';
import SearchPanel from './SearchPanel';

interface BlueprintEditorState {
  blueprint: BlueprintClass | null;
  selectedNodeId: string | null;
  selectedNodes: string[];
  selectedEdgeId: string | null;
  isDragging: boolean;
  panX: number;
  panY: number;
  zoom: number;
  showSearchPanel: boolean;
  showDetailsPanel: boolean;
  showPallete: boolean;
  compilationStatus: 'idle' | 'compiling' | 'success' | 'error';
  compilationErrors: string[];
}

export interface IBlueprintEditor {
  /**
   * UE5 API: Select one or more nodes
   */
  SelectNode(nodeId: string, bAddToSelection?: boolean): void;
  SelectMultiple(nodeIds: string[], bAddToSelection?: boolean): void;
  
  /**
   * UE5 API: Deselect nodes
   */
  DeselectAll(): void;
  
  /**
   * UE5 API: Delete selected nodes/edges
   */
  DeleteSelected(): void;
  
  /**
   * UE5 API: Duplicate selected nodes
   */
  DuplicateSelected(): void;
  
  /**
   * UE5 API: Compile blueprint
   */
  Compile(): Promise<boolean>;
  
  /**
   * UE5 API: Refresh the graph
   */
  RefreshGraph(): void;
  
  /**
   * UE5 API: Create a new node
   */
  CreateNode(nodeName: string, nodeClass: string, position: { x: number; y: number }): string;
  
  /**
   * UE5 API: Connect two pins
   */
  CreatePin(fromNodeId: string, toNodeId: string, fromPinId: string, toPinId: string): string;
  
  /**
   * UE5 API: Set node position
   */
  SetNodePosition(nodeId: string, position: { x: number; y: number }): void;
  
  /**
   * UE5 API: Get selected nodes
   */
  GetSelectedNodes(): BlueprintNode[];
  
  /**
   * UE5 API: Pan and zoom
   */
  ZoomToFit(): void;
  SetZoom(zoomLevel: number): void;
  Pan(deltaX: number, deltaY: number): void;
}

const BlueprintVisualEditor = React.forwardRef<IBlueprintEditor, { blueprint: BlueprintClass | null }>(
  ({ blueprint }, ref) => {
    const [state, setState] = useState<BlueprintEditorState>({
      blueprint,
      selectedNodeId: null,
      selectedNodes: [],
      selectedEdgeId: null,
      isDragging: false,
      panX: 0,
      panY: 0,
      zoom: 1,
      showSearchPanel: false,
      showDetailsPanel: true,
      showPallete: true,
      compilationStatus: 'idle',
      compilationErrors: [],
    });

    const canvasRef = useRef<View>(null);
    const editorRef = useRef<IBlueprintEditor>(null);

    // Expose the interface to parent components
    React.useImperativeHandle(ref, () => ({
      SelectNode: (nodeId: string, bAddToSelection = false) => {
        setState((prev) => ({
          ...prev,
          selectedNodeId: nodeId,
          selectedNodes: bAddToSelection ? [...prev.selectedNodes, nodeId] : [nodeId],
        }));
      },

      SelectMultiple: (nodeIds: string[], bAddToSelection = false) => {
        setState((prev) => ({
          ...prev,
          selectedNodes: bAddToSelection ? [...prev.selectedNodes, ...nodeIds] : nodeIds,
          selectedNodeId: nodeIds[0] || null,
        }));
      },

      DeselectAll: () => {
        setState((prev) => ({
          ...prev,
          selectedNodeId: null,
          selectedNodes: [],
          selectedEdgeId: null,
        }));
      },

      DeleteSelected: () => {
        if (state.selectedNodes.length === 0) return;
        setState((prev) => ({
          ...prev,
          selectedNodes: [],
          selectedNodeId: null,
        }));
      },

      DuplicateSelected: () => {
        // Implementation in EditorCanvas
      },

      Compile: async () => {
        setState((prev) => ({ ...prev, compilationStatus: 'compiling' }));
        try {
          // Validation logic
          setTimeout(() => {
            setState((prev) => ({ ...prev, compilationStatus: 'success' }));
          }, 1000);
          return true;
        } catch (error) {
          setState((prev) => ({
            ...prev,
            compilationStatus: 'error',
            compilationErrors: [String(error)],
          }));
          return false;
        }
      },

      RefreshGraph: () => {
        setState((prev) => ({ ...prev }));
      },

      CreateNode: (nodeName: string, nodeClass: string, position: { x: number; y: number }) => {
        const nodeId = `node_${Date.now()}`;
        return nodeId;
      },

      CreatePin: (fromNodeId: string, toNodeId: string, fromPinId: string, toPinId: string) => {
        return `edge_${Date.now()}`;
      },

      SetNodePosition: (nodeId: string, position: { x: number; y: number }) => {
        // Update node position in blueprint
      },

      GetSelectedNodes: () => {
        return state.blueprint?.eventGraphNodes.filter((n) => state.selectedNodes.includes(n.id)) || [];
      },

      ZoomToFit: () => {
        setState((prev) => ({ ...prev, zoom: 1, panX: 0, panY: 0 }));
      },

      SetZoom: (zoomLevel: number) => {
        setState((prev) => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoomLevel)) }));
      },

      Pan: (deltaX: number, deltaY: number) => {
        setState((prev) => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
        }));
      },
    }));

    useEffect(() => {
      setState((prev) => ({ ...prev, blueprint }));
    }, [blueprint]);

    const handleCanvasPress = (event: GestureResponderEvent) => {
      const { x, y } = event.nativeEvent;
      // Deselect all if clicking on empty canvas
      if (event.target === canvasRef.current) {
        setState((prev) => ({
          ...prev,
          selectedNodeId: null,
          selectedNodes: [],
        }));
      }
    };

    return (
      <View style={styles.container}>
        {/* Top Menu Bar (UE5 style) */}
        <View style={styles.menuBar}>
          <View style={styles.menuLeftGroup}>
            <Text style={styles.blueprintName}>{blueprint?.name || 'New Blueprint'}</Text>
            <View style={styles.separator} />
            <Pressable style={styles.menuButton} onPress={() => setState((prev) => ({ ...prev, showSearchPanel: !prev.showSearchPanel }))}>
              <MaterialCommunityIcons name="magnify" size={16} color="#cbd5e1" />
              <Text style={styles.menuButtonText}>Search</Text>
            </Pressable>
          </View>

          <View style={styles.menuCenterGroup}>
            <Pressable
              style={styles.compileButton}
              onPress={() => editorRef.current?.Compile()}
            >
              <MaterialCommunityIcons
                name={state.compilationStatus === 'success' ? 'check-circle' : 'circle'}
                size={16}
                color={
                  state.compilationStatus === 'success'
                    ? '#10b981'
                    : state.compilationStatus === 'error'
                    ? '#ef4444'
                    : '#06b6d4'
                }
              />
              <Text style={styles.menuButtonText}>Compile</Text>
            </Pressable>

            <Pressable style={styles.menuButton} onPress={() => editorRef.current?.RefreshGraph()}>
              <MaterialCommunityIcons name="refresh" size={16} color="#cbd5e1" />
              <Text style={styles.menuButtonText}>Refresh</Text>
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => editorRef.current?.Compile()}
            >
              <MaterialCommunityIcons name="play" size={16} color="#cbd5e1" />
              <Text style={styles.menuButtonText}>Execute</Text>
            </Pressable>
          </View>

          <View style={styles.menuRightGroup}>
            <Pressable
              style={styles.menuButton}
              onPress={() => setState((prev) => ({ ...prev, showDetailsPanel: !prev.showDetailsPanel }))}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={16} color="#cbd5e1" />
              <Text style={styles.menuButtonText}>Details</Text>
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => setState((prev) => ({ ...prev, showPallete: !prev.showPallete }))}
            >
              <MaterialCommunityIcons name="palette" size={16} color="#cbd5e1" />
              <Text style={styles.menuButtonText}>Palette</Text>
            </Pressable>
          </View>
        </View>

        {/* Compilation Status Bar */}
        {state.compilationStatus !== 'idle' && (
          <CompileStatusBar status={state.compilationStatus} errors={state.compilationErrors} />
        )}

        <View style={styles.mainContainer}>
          {/* Left Panel: Node Palette */}
          {state.showPallete && (
            <PallettePanel
              onNodeTypeSelected={(nodeType) => {
                // Add node to canvas
              }}
            />
          )}

          {/* Center: Canvas Editor */}
          <EditorCanvas
            ref={canvasRef}
            blueprint={state.blueprint}
            selectedNodeId={state.selectedNodeId}
            selectedNodes={state.selectedNodes}
            selectedEdgeId={state.selectedEdgeId}
            panX={state.panX}
            panY={state.panY}
            zoom={state.zoom}
            onNodeSelected={(nodeId, bAddToSelection) => {
              editorRef.current?.SelectNode(nodeId, bAddToSelection);
            }}
            onEdgeSelected={(edgeId) => {
              setState((prev) => ({ ...prev, selectedEdgeId: edgeId }));
            }}
            onCanvasPress={handleCanvasPress}
            onPan={(deltaX, deltaY) => {
              editorRef.current?.Pan(deltaX, deltaY);
            }}
            onZoom={(zoom) => {
              editorRef.current?.SetZoom(zoom);
            }}
          />

          {/* Right Panel: Details & Properties */}
          {state.showDetailsPanel && state.selectedNodeId && (
            <NodeConfigurationPanel />
          )}
        </View>

        {/* Search Panel Modal */}
        {state.showSearchPanel && (
          <SearchPanel
            blueprint={state.blueprint}
            onNodeSelected={(nodeId) => {
              editorRef.current?.SelectNode(nodeId);
              setState((prev) => ({ ...prev, showSearchPanel: false }));
            }}
            onClose={() => setState((prev) => ({ ...prev, showSearchPanel: false }))}
          />
        )}
      </View>
    );
  }
);

BlueprintVisualEditor.displayName = 'BlueprintVisualEditor';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
    minHeight: 44,
  },

  menuLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  menuCenterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  menuRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  blueprintName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },

  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#334155',
  },

  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },

  menuButtonText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  compileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default BlueprintVisualEditor;