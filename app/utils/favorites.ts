import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditorNode } from '../types/editor';
import { nanoid } from './id-generator';

export interface FavoriteNode {
  id: string;
  nodeId: string;
  name: string;
  node: EditorNode;
  createdAt: number;
  usageCount: number;
}

const FAVORITES_KEY = '@editor_favorites';

export async function addToFavorites(
  node: EditorNode,
  customName?: string
): Promise<FavoriteNode> {
  const favorite: FavoriteNode = {
    id: nanoid(),
    nodeId: node.id,
    name: customName || node.label,
    node: JSON.parse(JSON.stringify(node)),
    createdAt: Date.now(),
    usageCount: 0,
  };

  try {
    const existing = await getFavorites();
    const updated = [...existing, favorite];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return favorite;
  } catch (error) {
    console.error('Failed to add favorite:', error);
    throw error;
  }
}

export async function getFavorites(): Promise<FavoriteNode[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
}

export async function removeFromFavorites(id: string): Promise<void> {
  try {
    const existing = await getFavorites();
    const filtered = existing.filter((f) => f.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    throw error;
  }
}

export async function isFavorite(nodeId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some((f) => f.nodeId === nodeId);
  } catch (error) {
    console.error('Failed to check favorite:', error);
    return false;
  }
}

export async function updateFavoriteUsage(id: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const updated = favorites.map((f) =>
      f.id === id ? { ...f, usageCount: f.usageCount + 1 } : f
    );
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update favorite usage:', error);
    throw error;
  }
}
