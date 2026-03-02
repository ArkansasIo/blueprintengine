import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditorNode } from '../types/editor';
import { nanoid } from './id-generator';

export interface Bookmark {
  id: string;
  name: string;
  nodes: EditorNode[];
  thumbnail?: string;
  createdAt: number;
  usageCount: number;
}

const BOOKMARKS_KEY = '@editor_bookmarks';

export async function saveBookmark(
  name: string,
  nodes: EditorNode[]
): Promise<Bookmark> {
  const bookmark: Bookmark = {
    id: nanoid(),
    name,
    nodes,
    createdAt: Date.now(),
    usageCount: 0,
  };

  try {
    const existing = await getBookmarks();
    const updated = [...existing, bookmark];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return bookmark;
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    throw error;
  }
}

export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
}

export async function deleteBookmark(id: string): Promise<void> {
  try {
    const existing = await getBookmarks();
    const filtered = existing.filter((b) => b.id !== id);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    throw error;
  }
}

export async function updateBookmarkUsage(id: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const updated = bookmarks.map((b) =>
      b.id === id ? { ...b, usageCount: b.usageCount + 1 } : b
    );
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update bookmark usage:', error);
    throw error;
  }
}

export async function renameBookmark(id: string, newName: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const updated = bookmarks.map((b) =>
      b.id === id ? { ...b, name: newName } : b
    );
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to rename bookmark:', error);
    throw error;
  }
}
