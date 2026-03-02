// Node and Edge types for the visual editor
export type NodeType = 
  | 'input' 
  | 'output' 
  | 'logic' 
  | 'condition' 
  | 'action';

export interface Position {
  x: number;
  y: number;
}

export interface Pin {
  id: string;
  label: string;
  type: 'input' | 'output';
  dataType: 'boolean' | 'number' | 'string' | 'exec';
}

export interface EditorNode {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  pins: Pin[];
  data?: Record<string, any>;
  color?: string;
  comment?: string;
}

export interface Edge {
  id: string;
  fromNodeId: string;
  fromPinId: string;
  toNodeId: string;
  toPinId: string;
}

export interface Blueprint {
  id: string;
  name: string;
  nodes: EditorNode[];
  edges: Edge[];
  createdAt: number;
  updatedAt: number;
}

export interface EditorState {
  nodes: EditorNode[];
  edges: Edge[];
  selectedNodeId?: string;
  selectedEdgeId?: string;
  pan: Position;
  zoom: number;
}