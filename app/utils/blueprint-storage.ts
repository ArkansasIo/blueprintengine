import AsyncStorage from '@react-native-async-storage/async-storage';
import { Blueprint } from '../types/editor';

const BLUEPRINTS_KEY = '@blueprints';
const BLUEPRINT_PREFIX = '@blueprint_';

export async function saveBlueprint(blueprint: Blueprint): Promise<void> {
  try {
    const key = `${BLUEPRINT_PREFIX}${blueprint.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(blueprint));

    // Add to index
    const index = await getBlueprints();
    if (!index.find((b) => b.id === blueprint.id)) {
      index.push({
        id: blueprint.id,
        name: blueprint.name,
        createdAt: blueprint.createdAt,
        updatedAt: blueprint.updatedAt,
      });
      await AsyncStorage.setItem(BLUEPRINTS_KEY, JSON.stringify(index));
    }
  } catch (error) {
    console.error('Failed to save blueprint:', error);
    throw error;
  }
}

export async function loadBlueprint(id: string): Promise<Blueprint | null> {
  try {
    const key = `${BLUEPRINT_PREFIX}${id}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load blueprint:', error);
    return null;
  }
}

export async function deleteBlueprint(id: string): Promise<void> {
  try {
    const key = `${BLUEPRINT_PREFIX}${id}`;
    await AsyncStorage.removeItem(key);

    // Remove from index
    const index = await getBlueprints();
    const filtered = index.filter((b) => b.id !== id);
    await AsyncStorage.setItem(BLUEPRINTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete blueprint:', error);
    throw error;
  }
}

export async function getBlueprints(): Promise<
  Array<{ id: string; name: string; createdAt: number; updatedAt: number }>
> {
  try {
    const data = await AsyncStorage.getItem(BLUEPRINTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get blueprints:', error);
    return [];
  }
}

export function createNewBlueprint(name: string): Blueprint {
  const id = Math.random().toString(36).substr(2, 9);
  const now = Date.now();

  return {
    id,
    name,
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
  };
}