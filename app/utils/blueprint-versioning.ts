import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditorNode, Edge } from '../types/editor';
import { nanoid } from './id-generator';

export interface BlueprintVersion {
  id: string;
  blueprintId: string;
  version: number;
  nodes: EditorNode[];
  edges: Edge[];
  timestamp: number;
  message: string;
  author?: string;
}

export interface BlueprintChangelog {
  blueprintId: string;
  versions: BlueprintVersion[];
}

const VERSIONS_KEY = '@editor_blueprint_versions';

export async function saveVersion(
  blueprintId: string,
  nodes: EditorNode[],
  edges: Edge[],
  message: string
): Promise<BlueprintVersion> {
  try {
    const existing = await getVersions(blueprintId);
    const version = existing.length + 1;

    const versionEntry: BlueprintVersion = {
      id: nanoid(),
      blueprintId,
      version,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      timestamp: Date.now(),
      message,
    };

    const changelog = await getChangelog(blueprintId);
    changelog.versions.push(versionEntry);

    const allVersions = await getAllVersions();
    allVersions[blueprintId] = changelog;

    await AsyncStorage.setItem(VERSIONS_KEY, JSON.stringify(allVersions));
    return versionEntry;
  } catch (error) {
    console.error('Failed to save version:', error);
    throw error;
  }
}

export async function getVersions(blueprintId: string): Promise<BlueprintVersion[]> {
  try {
    const allVersions = await getAllVersions();
    return allVersions[blueprintId]?.versions || [];
  } catch (error) {
    console.error('Failed to get versions:', error);
    return [];
  }
}

export async function getChangelog(blueprintId: string): Promise<BlueprintChangelog> {
  try {
    const allVersions = await getAllVersions();
    return (
      allVersions[blueprintId] || {
        blueprintId,
        versions: [],
      }
    );
  } catch (error) {
    console.error('Failed to get changelog:', error);
    return { blueprintId, versions: [] };
  }
}

export async function getAllVersions(): Promise<Record<string, BlueprintChangelog>> {
  try {
    const data = await AsyncStorage.getItem(VERSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to get all versions:', error);
    return {};
  }
}

export async function restoreVersion(
  blueprintId: string,
  versionId: string
): Promise<{ nodes: EditorNode[]; edges: Edge[] } | null> {
  try {
    const versions = await getVersions(blueprintId);
    const version = versions.find((v) => v.id === versionId);
    if (!version) return null;

    return {
      nodes: JSON.parse(JSON.stringify(version.nodes)),
      edges: JSON.parse(JSON.stringify(version.edges)),
    };
  } catch (error) {
    console.error('Failed to restore version:', error);
    return null;
  }
}

export function calculateDiff(
  oldNodes: EditorNode[],
  newNodes: EditorNode[]
): { added: number; removed: number; modified: number } {
  const oldIds = new Set(oldNodes.map((n) => n.id));
  const newIds = new Set(newNodes.map((n) => n.id));

  const added = newIds.size - oldIds.size > 0 ? newIds.size - oldIds.size : 0;
  const removed = oldIds.size - newIds.size > 0 ? oldIds.size - newIds.size : 0;

  let modified = 0;
  newNodes.forEach((newNode) => {
    const oldNode = oldNodes.find((n) => n.id === newNode.id);
    if (oldNode && JSON.stringify(oldNode) !== JSON.stringify(newNode)) {
      modified++;
    }
  });

  return { added, removed, modified };
}
