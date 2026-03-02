import { create } from 'zustand';
import { EditorNode, Edge } from '../types/editor';

interface HistoryState {
  past: Array<{ nodes: EditorNode[]; edges: Edge[] }>;
  present: { nodes: EditorNode[]; edges: Edge[] };
  future: Array<{ nodes: EditorNode[]; edges: Edge[] }>;
  
  // History operations
  push: (state: { nodes: EditorNode[]; edges: Edge[] }) => void;
  undo: () => { nodes: EditorNode[]; edges: Edge[] } | null;
  redo: () => { nodes: EditorNode[]; edges: Edge[] } | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: { nodes: [], edges: [] },
  future: [],

  push: (state) =>
    set((s) => ({
      past: [...s.past, s.present],
      present: state,
      future: [],
    })),

  undo: () => {
    const { past, present, future } = get();
    if (past.length === 0) return null;

    const newPresent = past[past.length - 1];
    const newPast = past.slice(0, -1);
    const newFuture = [present, ...future];

    set({
      past: newPast,
      present: newPresent,
      future: newFuture,
    });

    return newPresent;
  },

  redo: () => {
    const { past, present, future } = get();
    if (future.length === 0) return null;

    const newPresent = future[0];
    const newFuture = future.slice(1);
    const newPast = [...past, present];

    set({
      past: newPast,
      present: newPresent,
      future: newFuture,
    });

    return newPresent;
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clear: () =>
    set({
      past: [],
      present: { nodes: [], edges: [] },
      future: [],
    }),
}));
