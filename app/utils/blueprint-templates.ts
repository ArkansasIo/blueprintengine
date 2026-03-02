import { Blueprint } from '../types/editor';
import { nanoid } from './id-generator';

export const BLUEPRINT_TEMPLATES: Record<string, Blueprint> = {
  // Simple counter pattern
  counter: {
    nodes: [
      {
        id: nanoid(),
        type: 'input',
        label: 'Start',
        position: { x: 50, y: 100 },
        pins: [
          { id: nanoid(), label: 'trigger', type: 'output', dataType: 'exec' },
        ],
        color: '#3b82f6',
      },
      {
        id: nanoid(),
        type: 'logic',
        label: 'Increment',
        position: { x: 250, y: 100 },
        pins: [
          { id: nanoid(), label: 'in', type: 'input', dataType: 'exec' },
          { id: nanoid(), label: 'value', type: 'input', dataType: 'number' },
          { id: nanoid(), label: 'out', type: 'output', dataType: 'exec' },
          { id: nanoid(), label: 'result', type: 'output', dataType: 'number' },
        ],
        color: '#f59e0b',
        data: { operation: 'increment', value: 0 },
      },
      {
        id: nanoid(),
        type: 'output',
        label: 'Result',
        position: { x: 450, y: 100 },
        pins: [
          { id: nanoid(), label: 'in', type: 'input', dataType: 'number' },
        ],
        color: '#10b981',
      },
    ],
    edges: [
      {
        id: nanoid(),
        fromNodeId: '',
        fromPinId: '',
        toNodeId: '',
        toPinId: '',
      },
    ],
  },

  // Conditional branch pattern
  conditional: {
    nodes: [
      {
        id: nanoid(),
        type: 'input',
        label: 'Check',
        position: { x: 50, y: 100 },
        pins: [
          { id: nanoid(), label: 'value', type: 'output', dataType: 'boolean' },
        ],
        color: '#3b82f6',
      },
      {
        id: nanoid(),
        type: 'condition',
        label: 'If',
        position: { x: 250, y: 100 },
        pins: [
          { id: nanoid(), label: 'condition', type: 'input', dataType: 'boolean' },
          { id: nanoid(), label: 'true', type: 'output', dataType: 'exec' },
          { id: nanoid(), label: 'false', type: 'output', dataType: 'exec' },
        ],
        color: '#ef4444',
      },
      {
        id: nanoid(),
        type: 'action',
        label: 'On True',
        position: { x: 450, y: 50 },
        pins: [
          { id: nanoid(), label: 'in', type: 'input', dataType: 'exec' },
        ],
        color: '#8b5cf6',
      },
      {
        id: nanoid(),
        type: 'action',
        label: 'On False',
        position: { x: 450, y: 150 },
        pins: [
          { id: nanoid(), label: 'in', type: 'input', dataType: 'exec' },
        ],
        color: '#8b5cf6',
      },
    ],
    edges: [],
  },

  // Loop pattern
  loop: {
    nodes: [
      {
        id: nanoid(),
        type: 'input',
        label: 'Count',
        position: { x: 50, y: 100 },
        pins: [
          { id: nanoid(), label: 'count', type: 'output', dataType: 'number' },
        ],
        color: '#3b82f6',
        data: { defaultValue: 5 },
      },
      {
        id: nanoid(),
        type: 'logic',
        label: 'Loop',
        position: { x: 250, y: 100 },
        pins: [
          { id: nanoid(), label: 'count', type: 'input', dataType: 'number' },
          { id: nanoid(), label: 'body', type: 'output', dataType: 'exec' },
          { id: nanoid(), label: 'complete', type: 'output', dataType: 'exec' },
        ],
        color: '#f59e0b',
      },
      {
        id: nanoid(),
        type: 'action',
        label: 'Loop Body',
        position: { x: 450, y: 100 },
        pins: [
          { id: nanoid(), label: 'in', type: 'input', dataType: 'exec' },
        ],
        color: '#8b5cf6',
      },
    ],
    edges: [],
  },

  // Data transformation pattern
  transform: {
    nodes: [
      {
        id: nanoid(),
        type: 'input',
        label: 'Input Data',
        position: { x: 50, y: 100 },
        pins: [
          { id: nanoid(), label: 'data', type: 'output', dataType: 'string' },
        ],
        color: '#3b82f6',
      },
      {
        id: nanoid(),
        type: 'logic',
        label: 'Process',
        position: { x: 250, y: 100 },
        pins: [
          { id: nanoid(), label: 'input', type: 'input', dataType: 'string' },
          { id: nanoid(), label: 'output', type: 'output', dataType: 'string' },
        ],
        color: '#f59e0b',
      },
      {
        id: nanoid(),
        type: 'output',
        label: 'Output',
        position: { x: 450, y: 100 },
        pins: [
          { id: nanoid(), label: 'result', type: 'input', dataType: 'string' },
        ],
        color: '#10b981',
      },
    ],
    edges: [],
  },
};

export function getTemplateByName(name: keyof typeof BLUEPRINT_TEMPLATES): Blueprint | null {
  return BLUEPRINT_TEMPLATES[name] || null;
}

export function listTemplates(): string[] {
  return Object.keys(BLUEPRINT_TEMPLATES);
}
