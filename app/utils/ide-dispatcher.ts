/**
 * IDE Command Dispatcher - Central hub for all IDE actions and commands
 */

import { EditorNode, Edge } from '../types/editor';
import * as EditorActions from './editor-actions';

export type CommandCategory =
  | 'file'
  | 'edit'
  | 'view'
  | 'insert'
  | 'arrange'
  | 'tools'
  | 'window'
  | 'help';

export interface Command {
  id: string;
  category: CommandCategory;
  action: string;
  payload?: any;
  timestamp: number;
}

export interface CommandHistory {
  commands: Command[];
  currentIndex: number;
}

export interface IDEState {
  nodes: EditorNode[];
  edges: Edge[];
  selectedNodeIds: string[];
  clipboard: EditorNode[];
  zoom: number;
  panX: number;
  panY: number;
  gridVisible: boolean;
  snapEnabled: boolean;
}

export interface CommandHandler {
  (state: IDEState, payload?: any): IDEState | void;
}

export interface CommandRegistry {
  [key: string]: CommandHandler;
}

// ===== COMMAND HANDLERS =====

export const createCommandRegistry = (): CommandRegistry => {
  return {
    // File Commands
    'file:new': (state) => ({
      ...state,
      nodes: [],
      edges: [],
      selectedNodeIds: [],
      clipboard: [],
    }),

    'file:open': (state, payload) => ({
      ...state,
      nodes: payload.nodes || [],
      edges: payload.edges || [],
      selectedNodeIds: [],
    }),

    'file:save': (state, payload) => {
      console.log('Saving blueprint:', { nodes: state.nodes, edges: state.edges });
      return state;
    },

    // Edit Commands
    'edit:undo': (state) => state,

    'edit:redo': (state) => state,

    'edit:cut': (state) => {
      const selectedNodes = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      const remainingNodes = EditorActions.deleteNodes(state.nodes, state.selectedNodeIds);
      const remainingEdges = EditorActions.deleteEdges(
        state.edges,
        state.edges
          .filter(
            (e) =>
              state.selectedNodeIds.includes(e.fromNodeId) ||
              state.selectedNodeIds.includes(e.toNodeId)
          )
          .map((e) => e.id)
      );

      return {
        ...state,
        nodes: remainingNodes,
        edges: remainingEdges,
        clipboard: selectedNodes,
        selectedNodeIds: [],
      };
    },

    'edit:copy': (state) => {
      const selectedNodes = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      return {
        ...state,
        clipboard: selectedNodes,
      };
    },

    'edit:paste': (state) => {
      const offset = { x: 20, y: 20 };
      const newNodes = state.clipboard.map((n) => EditorActions.duplicateNode(n, offset));
      return {
        ...state,
        nodes: [...state.nodes, ...newNodes],
        selectedNodeIds: newNodes.map((n) => n.id),
      };
    },

    'edit:duplicate': (state) => {
      const selectedNodes = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      const offset = { x: 20, y: 20 };
      const duplicated = selectedNodes.map((n) => EditorActions.duplicateNode(n, offset));
      return {
        ...state,
        nodes: [...state.nodes, ...duplicated],
        selectedNodeIds: duplicated.map((n) => n.id),
      };
    },

    'edit:delete': (state) => {
      const result = EditorActions.deleteNodesAndConnections(
        state.nodes,
        state.edges,
        state.selectedNodeIds
      );
      return {
        ...state,
        nodes: result.nodes,
        edges: result.edges,
        selectedNodeIds: [],
      };
    },

    'edit:select-all': (state) => ({
      ...state,
      selectedNodeIds: state.nodes.map((n) => n.id),
    }),

    'edit:deselect': (state) => ({
      ...state,
      selectedNodeIds: [],
    }),

    // View Commands
    'view:zoom-in': (state) => ({
      ...state,
      zoom: Math.min(state.zoom * 1.2, 5),
    }),

    'view:zoom-out': (state) => ({
      ...state,
      zoom: Math.max(state.zoom / 1.2, 0.1),
    }),

    'view:zoom-reset': (state) => ({
      ...state,
      zoom: 1,
    }),

    'view:fit-screen': (state, payload) => {
      const transform = EditorActions.fitToScreen(state.nodes, payload.width, payload.height);
      return {
        ...state,
        zoom: transform.scale,
        panX: transform.panX,
        panY: transform.panY,
      };
    },

    'view:pan-up': (state) => ({
      ...state,
      panY: state.panY - 20,
    }),

    'view:pan-down': (state) => ({
      ...state,
      panY: state.panY + 20,
    }),

    'view:pan-left': (state) => ({
      ...state,
      panX: state.panX - 20,
    }),

    'view:pan-right': (state) => ({
      ...state,
      panX: state.panX + 20,
    }),

    // Alignment Commands
    'align:left': (state) => {
      const selected = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      if (selected.length === 0) return state;

      const aligned = EditorActions.alignNodesLeft(selected);
      const updated = state.nodes.map((n) => aligned.find((a) => a.id === n.id) || n);

      return {
        ...state,
        nodes: updated,
      };
    },

    'align:center-h': (state) => {
      const selected = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      if (selected.length === 0) return state;

      const aligned = EditorActions.alignNodesCenterHorizontal(selected);
      const updated = state.nodes.map((n) => aligned.find((a) => a.id === n.id) || n);

      return {
        ...state,
        nodes: updated,
      };
    },

    'align:right': (state) => {
      const selected = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      if (selected.length === 0) return state;

      const aligned = EditorActions.alignNodesRight(selected);
      const updated = state.nodes.map((n) => aligned.find((a) => a.id === n.id) || n);

      return {
        ...state,
        nodes: updated,
      };
    },

    'align:top': (state) => {
      const selected = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      if (selected.length === 0) return state;

      const aligned = EditorActions.alignNodesTop(selected);
      const updated = state.nodes.map((n) => aligned.find((a) => a.id === n.id) || n);

      return {
        ...state,
        nodes: updated,
      };
    },

    'align:center-v': (state) => {
      const selected = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      if (selected.length === 0) return state;

      const aligned = EditorActions.alignNodesCenterVertical(selected);
      const updated = state.nodes.map((n) => aligned.find((a) => a.id === n.id) || n);

      return {
        ...state,
        nodes: updated,
      };
    },

    'align:bottom': (state) => {
      const selected = state.nodes.filter((n) => state.selectedNodeIds.includes(n.id));
      if (selected.length === 0) return state;

      const aligned = EditorActions.alignNodesBottom(selected);
      const updated = state.nodes.map((n) => aligned.find((a) => a.id === n.id) || n);

      return {
        ...state,
        nodes: updated,
      };
    },

    // Tool Commands
    'tool:validate': (state) => {
      const result = EditorActions.validateGraph(state.nodes, state.edges);
      console.log('Validation result:', result);
      return state;
    },

    'tool:execute': (state) => {
      console.log('Executing blueprint...');
      return state;
    },

    'tool:search': (state) => {
      console.log('Opening search...');
      return state;
    },

    // Insert Commands
    'insert:node': (state, payload) => {
      const newNode = EditorActions.createNode(
        payload.label || 'New Node',
        payload.type || 'Process',
        payload.position || { x: 100, y: 100 },
        payload.color || '#3b82f6'
      );
      return {
        ...state,
        nodes: [...state.nodes, newNode],
        selectedNodeIds: [newNode.id],
      };
    },
  };
};

// ===== DISPATCHER CLASS =====

export class IDEDispatcher {
  private registry: CommandRegistry;
  private history: CommandHistory;
  private state: IDEState;

  constructor(initialState: IDEState) {
    this.registry = createCommandRegistry();
    this.state = initialState;
    this.history = {
      commands: [],
      currentIndex: -1,
    };
  }

  dispatch(command: Command): IDEState {
    const handler = this.registry[command.id];

    if (!handler) {
      console.warn(`No handler found for command: ${command.id}`);
      return this.state;
    }

    try {
      const result = handler(this.state, command.payload);
      if (result) {
        this.state = result;
        this.addToHistory(command);
      }
      return this.state;
    } catch (error) {
      console.error(`Error executing command ${command.id}:`, error);
      return this.state;
    }
  }

  private addToHistory(command: Command): void {
    // Remove any commands after current index
    this.history.commands = this.history.commands.slice(0, this.history.currentIndex + 1);
    this.history.commands.push(command);
    this.history.currentIndex++;
  }

  getState(): IDEState {
    return this.state;
  }

  setState(state: IDEState): void {
    this.state = state;
  }

  canUndo(): boolean {
    return this.history.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.history.currentIndex < this.history.commands.length - 1;
  }

  undo(): IDEState {
    if (!this.canUndo()) return this.state;
    this.history.currentIndex--;
    // Replay commands up to current index
    this.replayHistory();
    return this.state;
  }

  redo(): IDEState {
    if (!this.canRedo()) return this.state;
    this.history.currentIndex++;
    this.replayHistory();
    return this.state;
  }

  private replayHistory(): void {
    let currentState = this.getInitialState();
    for (let i = 0; i <= this.history.currentIndex; i++) {
      const command = this.history.commands[i];
      const handler = this.registry[command.id];
      if (handler) {
        const result = handler(currentState, command.payload);
        if (result) {
          currentState = result;
        }
      }
    }
    this.state = currentState;
  }

  private getInitialState(): IDEState {
    return {
      nodes: [],
      edges: [],
      selectedNodeIds: [],
      clipboard: [],
      zoom: 1,
      panX: 0,
      panY: 0,
      gridVisible: true,
      snapEnabled: true,
    };
  }

  registerCommand(id: string, handler: CommandHandler): void {
    this.registry[id] = handler;
  }

  getHistory(): Command[] {
    return this.history.commands;
  }

  clearHistory(): void {
    this.history = {
      commands: [],
      currentIndex: -1,
    };
  }
}

// ===== COMMAND FACTORY =====

export function createCommand(
  id: string,
  category: CommandCategory,
  payload?: any
): Command {
  return {
    id,
    category,
    action: id,
    payload,
    timestamp: Date.now(),
  };
}

export function createFileCommand(action: string, payload?: any): Command {
  return createCommand(`file:${action}`, 'file', payload);
}

export function createEditCommand(action: string, payload?: any): Command {
  return createCommand(`edit:${action}`, 'edit', payload);
}

export function createViewCommand(action: string, payload?: any): Command {
  return createCommand(`view:${action}`, 'view', payload);
}

export function createInsertCommand(action: string, payload?: any): Command {
  return createCommand(`insert:${action}`, 'insert', payload);
}

export function createAlignCommand(action: string, payload?: any): Command {
  return createCommand(`align:${action}`, 'arrange', payload);
}

export function createToolCommand(action: string, payload?: any): Command {
  return createCommand(`tool:${action}`, 'tools', payload);
}
