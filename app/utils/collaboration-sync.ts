import { EditorNode, Edge } from '../types/editor';

export interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  lastActive: number;
  cursorPosition?: { x: number; y: number };
  selectedNodeId?: string;
}

export interface SyncMessage {
  type: 'node-add' | 'node-update' | 'node-delete' | 'edge-add' | 'edge-delete' | 'cursor' | 'selection';
  userId: string;
  timestamp: number;
  payload: any;
}

export interface CollaborationState {
  users: CollaborativeUser[];
  activeEdits: Map<string, { userId: string; editType: string; timestamp: number }>;
  conflictLog: SyncMessage[];
}

export const userColors = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
];

export function initializeCollaborationState(): CollaborationState {
  return {
    users: [],
    activeEdits: new Map(),
    conflictLog: [],
  };
}

export function addUser(
  state: CollaborationState,
  userId: string,
  name: string
): CollaborativeUser {
  const color = userColors[state.users.length % userColors.length];
  const user: CollaborativeUser = {
    id: userId,
    name,
    color,
    lastActive: Date.now(),
  };
  state.users.push(user);
  return user;
}

export function removeUser(state: CollaborationState, userId: string): void {
  state.users = state.users.filter((u) => u.id !== userId);
  // Remove active edits by this user
  Array.from(state.activeEdits.entries()).forEach(([key, value]) => {
    if (value.userId === userId) {
      state.activeEdits.delete(key);
    }
  });
}

export function recordEdit(
  state: CollaborationState,
  userId: string,
  editId: string,
  editType: string
): void {
  state.activeEdits.set(editId, {
    userId,
    editType,
    timestamp: Date.now(),
  });

  // Clean up old edits (older than 30 seconds)
  const now = Date.now();
  Array.from(state.activeEdits.entries()).forEach(([key, value]) => {
    if (now - value.timestamp > 30000) {
      state.activeEdits.delete(key);
    }
  });
}

export function createSyncMessage(
  type: SyncMessage['type'],
  userId: string,
  payload: any
): SyncMessage {
  return {
    type,
    userId,
    timestamp: Date.now(),
    payload,
  };
}

export function detectConflict(
  message1: SyncMessage,
  message2: SyncMessage
): boolean {
  // Same node/edge modification within 1 second
  if (message1.type === message2.type && Math.abs(message1.timestamp - message2.timestamp) < 1000) {
    if ((message1.type === 'node-update' || message1.type === 'edge-delete') &&
        message1.payload.id === message2.payload.id) {
      return true;
    }
  }
  return false;
}

export function resolveConflict(
  local: SyncMessage,
  remote: SyncMessage
): SyncMessage {
  // Last-write-wins strategy
  if (remote.timestamp > local.timestamp) {
    return remote;
  }
  return local;
}

export function broadcastNodeChange(
  node: EditorNode,
  userId: string,
  operation: 'add' | 'update' | 'delete'
): SyncMessage {
  const type = `node-${operation}` as SyncMessage['type'];
  return createSyncMessage(type, userId, node);
}

export function broadcastEdgeChange(
  edge: Edge,
  userId: string,
  operation: 'add' | 'delete'
): SyncMessage {
  const type = `edge-${operation}` as SyncMessage['type'];
  return createSyncMessage(type, userId, edge);
}

export function broadcastCursorPosition(
  userId: string,
  position: { x: number; y: number }
): SyncMessage {
  return createSyncMessage('cursor', userId, { position });
}

export function broadcastSelectionChange(
  userId: string,
  selectedNodeId: string | null
): SyncMessage {
  return createSyncMessage('selection', userId, { selectedNodeId });
}

export function getActiveUserEdits(
  state: CollaborationState,
  userId: string
): { editId: string; editType: string }[] {
  const edits: { editId: string; editType: string }[] = [];
  Array.from(state.activeEdits.entries()).forEach(([editId, value]) => {
    if (value.userId === userId) {
      edits.push({ editId, editType: value.editType });
    }
  });
  return edits;
}

export function getConflictingEdits(
  state: CollaborationState,
  editId: string
): { userId: string; editType: string }[] {
  const results: { userId: string; editType: string }[] = [];
  state.activeEdits.forEach((value) => {
    if (value.editType === state.activeEdits.get(editId)?.editType) {
      results.push({ userId: value.userId, editType: value.editType });
    }
  });
  return results;
}
