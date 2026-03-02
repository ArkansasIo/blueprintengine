import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditorNode, NodeType, Pin } from '../types/editor';
import { nanoid } from './id-generator';

export interface CustomNodeTemplate {
  id: string;
  name: string;
  description: string;
  type: NodeType;
  color: string;
  pins: Pin[];
  data?: Record<string, any>;
  createdAt: number;
  usageCount: number;
}

const TEMPLATES_KEY = '@editor_custom_templates';

export async function saveCustomTemplate(
  name: string,
  description: string,
  nodeType: NodeType,
  color: string,
  pins: Pin[],
  data?: Record<string, any>
): Promise<CustomNodeTemplate> {
  const template: CustomNodeTemplate = {
    id: nanoid(),
    name,
    description,
    type: nodeType,
    color,
    pins,
    data,
    createdAt: Date.now(),
    usageCount: 0,
  };

  try {
    const existing = await getCustomTemplates();
    const updated = [...existing, template];
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
    return template;
  } catch (error) {
    console.error('Failed to save custom template:', error);
    throw error;
  }
}

export async function getCustomTemplates(): Promise<CustomNodeTemplate[]> {
  try {
    const data = await AsyncStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get custom templates:', error);
    return [];
  }
}

export async function deleteCustomTemplate(id: string): Promise<void> {
  try {
    const existing = await getCustomTemplates();
    const filtered = existing.filter((t) => t.id !== id);
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete custom template:', error);
    throw error;
  }
}

export async function updateTemplateUsage(id: string): Promise<void> {
  try {
    const templates = await getCustomTemplates();
    const updated = templates.map((t) =>
      t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update template usage:', error);
    throw error;
  }
}

export function createNodeFromTemplate(
  template: CustomNodeTemplate,
  position: { x: number; y: number }
): EditorNode {
  return {
    id: nanoid(),
    type: template.type,
    label: template.name,
    position,
    pins: template.pins.map((pin) => ({
      ...pin,
      id: nanoid(),
    })),
    data: { ...template.data },
    color: template.color,
  };
}
