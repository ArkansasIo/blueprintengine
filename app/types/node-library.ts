import { EditorNode, NodeType } from './editor';

export interface NodeTemplate {
  id: string;
  name: string;
  category: string;
  type: NodeType;
  description: string;
  pins: {
    id: string;
    label: string;
    type: 'input' | 'output';
    dataType: 'boolean' | 'number' | 'string' | 'exec';
  }[];
  data?: Record<string, any>;
}

export const RPG_NODE_TEMPLATES: NodeTemplate[] = [
  // Stats & Attributes
  {
    id: 'get-attribute',
    name: 'Get Attribute',
    category: 'Stats',
    type: 'logic',
    description: 'Retrieve a character attribute (STR, DEX, INT, etc.)',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'attr', label: 'Attribute', type: 'input', dataType: 'string' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
      { id: 'value', label: 'Value', type: 'output', dataType: 'number' },
    ],
    data: { attributeName: 'STR' },
  },
  {
    id: 'set-attribute',
    name: 'Set Attribute',
    category: 'Stats',
    type: 'action',
    description: 'Set a character attribute value',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'attr', label: 'Attribute', type: 'input', dataType: 'string' },
      { id: 'value', label: 'Value', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
    ],
    data: { attributeName: 'STR', value: 10 },
  },

  // Combat
  {
    id: 'calculate-damage',
    name: 'Calculate Damage',
    category: 'Combat',
    type: 'logic',
    description: 'Compute damage from attacker stats',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'attack', label: 'Attack Power', type: 'input', dataType: 'number' },
      { id: 'defense', label: 'Defense', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
      { id: 'damage', label: 'Damage', type: 'output', dataType: 'number' },
    ],
  },
  {
    id: 'apply-damage',
    name: 'Apply Damage',
    category: 'Combat',
    type: 'action',
    description: 'Apply damage to target',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'target', label: 'Target', type: 'input', dataType: 'string' },
      { id: 'damage', label: 'Damage', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
    ],
  },

  // Abilities
  {
    id: 'can-activate-ability',
    name: 'Can Activate Ability',
    category: 'Abilities',
    type: 'condition',
    description: 'Check if ability can be activated',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'ability', label: 'Ability ID', type: 'input', dataType: 'string' },
      { id: 'out-true', label: 'True', type: 'output', dataType: 'exec' },
      { id: 'out-false', label: 'False', type: 'output', dataType: 'exec' },
    ],
  },
  {
    id: 'start-cooldown',
    name: 'Start Cooldown',
    category: 'Abilities',
    type: 'action',
    description: 'Start ability cooldown',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'ability', label: 'Ability ID', type: 'input', dataType: 'string' },
      { id: 'duration', label: 'Duration (s)', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
    ],
    data: { duration: 5 },
  },

  // Inventory
  {
    id: 'add-item',
    name: 'Add Item',
    category: 'Inventory',
    type: 'action',
    description: 'Add item to inventory',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'item', label: 'Item ID', type: 'input', dataType: 'string' },
      { id: 'quantity', label: 'Quantity', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
    ],
    data: { quantity: 1 },
  },
  {
    id: 'remove-item',
    name: 'Remove Item',
    category: 'Inventory',
    type: 'action',
    description: 'Remove item from inventory',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'item', label: 'Item ID', type: 'input', dataType: 'string' },
      { id: 'quantity', label: 'Quantity', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
    ],
    data: { quantity: 1 },
  },

  // Events
  {
    id: 'event-on-level-up',
    name: 'On Level Up',
    category: 'Events',
    type: 'input',
    description: 'Event fired when character levels up',
    pins: [
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
      { id: 'new-level', label: 'New Level', type: 'output', dataType: 'number' },
    ],
  },
  {
    id: 'event-on-death',
    name: 'On Death',
    category: 'Events',
    type: 'input',
    description: 'Event fired when character dies',
    pins: [
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
      { id: 'killer', label: 'Killer', type: 'output', dataType: 'string' },
    ],
  },

  // Utility
  {
    id: 'delay',
    name: 'Delay',
    category: 'Flow',
    type: 'logic',
    description: 'Wait before continuing',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'seconds', label: 'Seconds', type: 'input', dataType: 'number' },
      { id: 'out', label: 'Out', type: 'output', dataType: 'exec' },
    ],
    data: { seconds: 1 },
  },
  {
    id: 'branch',
    name: 'Branch',
    category: 'Flow',
    type: 'condition',
    description: 'Conditional branch',
    pins: [
      { id: 'in', label: 'In', type: 'input', dataType: 'exec' },
      { id: 'condition', label: 'Condition', type: 'input', dataType: 'boolean' },
      { id: 'out-true', label: 'True', type: 'output', dataType: 'exec' },
      { id: 'out-false', label: 'False', type: 'output', dataType: 'exec' },
    ],
  },
];

export function getNodeTemplate(templateId: string): NodeTemplate | undefined {
  return RPG_NODE_TEMPLATES.find((t) => t.id === templateId);
}

export function createNodeFromTemplate(template: NodeTemplate): EditorNode {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: template.type,
    label: template.name,
    position: { x: Math.random() * 300, y: Math.random() * 300 },
    pins: template.pins,
    data: template.data || {},
    color: template.name,
  };
}
