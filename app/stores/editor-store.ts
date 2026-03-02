import { create } from 'zustand';
import { EditorState, EditorNode, Edge, Blueprint } from '../types/editor';
import { nanoid } from '../utils/id-generator';
import { useHistoryStore } from './history-store';

interface EditorStore extends EditorState {
  // Node operations
  addNode: (node: EditorNode) => void;
  updateNode: (id: string, updates: Partial<EditorNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | undefined) => void;
  selectAllNodes: () => void;
  deselectAll: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  copySelected: () => void;
  pasteNodes: () => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;

  // Edge operations
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  selectEdge: (id: string | undefined) => void;

  // Canvas operations
  setPan: (pan: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  pan: (delta: { x: number; y: number }) => void;

  // Blueprint operations
  clearBlueprint: () => void;
  loadBlueprint: (blueprint: Blueprint) => void;

  // UI operations
  openSearch: () => void;
  compileBlueprint: () => void;

  // Additional properties
  selectedNodes: string[];
  clipboard: { nodes: EditorNode[]; edges: Edge[] };

  // History helper
  recordHistory: () => void;
}

const recordHistorySnapshot = (state: { nodes: EditorNode[]; edges: Edge[] }) => {
  useHistoryStore.getState().push(state);
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: undefined,
  selectedEdgeId: undefined,
  pan: { x: 0, y: 0 },
  zoom: 1,

  addNode: (node) =>
    set((state) => {
      const newState = { nodes: [...state.nodes, node] };
      recordHistorySnapshot(newState);
      return newState;
    }),

  updateNode: (id, updates) =>
    set((state) => {
      const newState = {
        nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      };
      recordHistorySnapshot(newState);
      return newState;
    }),

  deleteNode: (id) =>
    set((state) => {
      const newState = {
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter(
          (e) => e.fromNodeId !== id && e.toNodeId !== id
        ),
        selectedNodeId: state.selectedNodeId === id ? undefined : state.selectedNodeId,
      };
      recordHistorySnapshot(newState);
      return newState;
    }),

  selectNode: (id) =>
    set({
      selectedNodeId: id,
      selectedEdgeId: undefined,
    }),

  addEdge: (edge) =>
    set((state) => {
      const newState = { edges: [...state.edges, edge] };
      recordHistorySnapshot(newState);
      return newState;
    }),

  deleteEdge: (id) =>
    set((state) => {
      const newState = {
        edges: state.edges.filter((e) => e.id !== id),
        selectedEdgeId: undefined,
      };
      recordHistorySnapshot(newState);
      return newState;
    }),

  selectEdge: (id) =>
    set({
      selectedEdgeId: id,
      selectedNodeId: undefined,
    }),

  setPan: (pan) => set({ pan }),
  setZoom: (zoom) => set({ zoom }),

  clearBlueprint: () =>
    set({
      nodes: [],
      edges: [],
      selectedNodeId: undefined,
      selectedEdgeId: undefined,
      pan: { x: 0, y: 0 },
      zoom: 1,
    }),

  loadBlueprint: (blueprint) =>
    set({
      nodes: blueprint.nodes,
      edges: blueprint.edges,
      selectedNodeId: undefined,
      selectedEdgeId: undefined,
    }),

  recordHistory: () => {
    const state = get();
    recordHistorySnapshot({ nodes: state.nodes, edges: state.edges });
  },

  // Additional operations
  selectedNodes: [] as string[],
  selectedEdgeId: undefined as string | undefined,
  draggedConnection: null as any,
  clipboard: { nodes: [] as EditorNode[], edges: [] as Edge[] },

  selectAllNodes: () => {
    set((state) => ({
      selectedNodes: state.nodes.map((n) => n.id),
    }));
  },

  deselectAll: () => {
    set({
      selectedNodes: [],
      selectedNodeId: undefined,
      selectedEdgeId: undefined,
    });
  },

  deleteSelected: () => {
    set((state) => {
      const newNodes = state.nodes.filter((n) => !state.selectedNodes.includes(n.id));
      const newEdges = state.edges.filter(
        (e) =>
          !state.selectedNodes.includes(e.fromNodeId) &&
          !state.selectedNodes.includes(e.toNodeId)
      );
      recordHistorySnapshot({ nodes: newNodes, edges: newEdges });
      return {
        nodes: newNodes,
        edges: newEdges,
        selectedNodes: [],
        selectedNodeId: undefined,
      };
    });
  },

  duplicateSelected: () => {
    set((state) => {
      const selectedNodeObjs = state.nodes.filter((n) =>
        state.selectedNodes.includes(n.id)
      );
      const selectedEdgeObjs = state.edges.filter((e) =>
        selectedNodeObjs.some((n) => n.id === e.fromNodeId) &&
        selectedNodeObjs.some((n) => n.id === e.toNodeId)
      );

      const idMap: Record<string, string> = {};
      const newNodes = selectedNodeObjs.map((node) => {
        const newId = nanoid();
        idMap[node.id] = newId;
        return {
          ...node,
          id: newId,
          position: { x: node.position.x + 20, y: node.position.y + 20 },
        };
      });

      const newEdges = selectedEdgeObjs.map((edge) => ({
        ...edge,
        id: nanoid(),
        fromNodeId: idMap[edge.fromNodeId],
        toNodeId: idMap[edge.toNodeId],
      }));

      const allNodes = [...state.nodes, ...newNodes];
      const allEdges = [...state.edges, ...newEdges];

      recordHistorySnapshot({ nodes: allNodes, edges: allEdges });

      return {
        nodes: allNodes,
        edges: allEdges,
        selectedNodes: newNodes.map((n) => n.id),
      };
    });
  },

  copySelected: () => {
    set((state) => {
      const selectedNodeObjs = state.nodes.filter((n) =>
        state.selectedNodes.includes(n.id)
      );
      const selectedEdgeObjs = state.edges.filter((e) =>
        selectedNodeObjs.some((n) => n.id === e.fromNodeId) &&
        selectedNodeObjs.some((n) => n.id === e.toNodeId)
      );

      return {
        clipboard: {
          nodes: selectedNodeObjs,
          edges: selectedEdgeObjs,
        },
      };
    });
  },

  pasteNodes: () => {
    set((state) => {
      const { clipboard } = state;
      if (clipboard.nodes.length === 0) return state;

      const idMap: Record<string, string> = {};
      const newNodes = clipboard.nodes.map((node) => {
        const newId = nanoid();
        idMap[node.id] = newId;
        return {
          ...node,
          id: newId,
          position: { x: node.position.x + 30, y: node.position.y + 30 },
        };
      });

      const newEdges = clipboard.edges.map((edge) => ({
        ...edge,
        id: nanoid(),
        fromNodeId: idMap[edge.fromNodeId],
        toNodeId: idMap[edge.toNodeId],
      }));

      const allNodes = [...state.nodes, ...newNodes];
      const allEdges = [...state.edges, ...newEdges];

      recordHistorySnapshot({ nodes: allNodes, edges: allEdges });

      return {
        nodes: allNodes,
        edges: allEdges,
        selectedNodes: newNodes.map((n) => n.id),
      };
    });
  },

  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => {
    set((state) => {
      const newNodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, position } : n
      );
      recordHistorySnapshot({ nodes: newNodes, edges: state.edges });
      return { nodes: newNodes };
    });
  },

  openSearch: () => {
    // Handled by parent component
  },

  compileBlueprint: () => {
    // Handled by parent component
  },

  pan: (delta: { x: number; y: number }) => {
    set((state) => ({
      pan: {
        x: state.pan.x + delta.x,
        y: state.pan.y + delta.y,
      },
    }));
  },
}));