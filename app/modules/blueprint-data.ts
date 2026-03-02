/**
 * Blueprint Data Module
 * Comprehensive data management, storage, and serialization
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Blueprint } from '@/app/classes/Blueprint';
import { BlueprintSerializable, BlueprintVersion, BlueprintMetadata } from '@/app/types/blueprint';
import { EditorNode, EditorEdge, Variable, Function, Event } from '@/app/types/nodes';

const STORAGE_KEY_PREFIX = '@blueprint_';
const BLUEPRINTS_INDEX_KEY = '@blueprints_index';
const VERSIONS_PREFIX = '@versions_';
const METADATA_PREFIX = '@metadata_';

/**
 * Blueprint Data Manager
 * Handles all data operations for blueprints
 */
export class BlueprintDataManager {
  /**
   * Save blueprint to storage
   */
  static async saveBlueprint(blueprint: Blueprint): Promise<boolean> {
    try {
      const key = `${STORAGE_KEY_PREFIX}${blueprint.id}`;
      const data: BlueprintSerializable = {
        version: '1.0',
        formatVersion: '1',
        blueprint: {
          id: blueprint.id,
          name: blueprint.name,
          description: blueprint.description,
          version: blueprint.version,
          parentClass: blueprint.parentClass,
          nodes: blueprint.nodes,
          edges: blueprint.edges,
          variables: blueprint.variables,
          functions: blueprint.functions,
          events: blueprint.events,
          created: blueprint.created,
          modified: blueprint.modified,
          author: blueprint.author,
          tags: blueprint.tags,
          category: blueprint.category,
          isDirty: blueprint.isDirty,
          isCompiled: blueprint.isCompiled,
          lastCompiled: blueprint.lastCompiled,
          settings: blueprint.settings,
          properties: blueprint.properties,
        },
        metadata: {
          blueprintId: blueprint.id,
          searchTags: [],
          relatedBlueprints: [],
          dependencies: [],
          statistics: blueprint.getStatistics(),
          performance: {
            estimatedExecutionTime: 0,
            memoryFootprint: 0,
            cpuUsage: 0,
            lastProfiledAt: new Date(),
            profiledCount: 0,
          },
        },
        checksums: {
          blueprintHash: this.generateHash(JSON.stringify(blueprint)),
          contentHash: this.generateHash(JSON.stringify(blueprint.nodes)),
          dataHash: this.generateHash(JSON.stringify(blueprint.variables)),
          timestamp: new Date(),
        },
      };

      await AsyncStorage.setItem(key, JSON.stringify(data));
      await this.updateBlueprintIndex(blueprint.id, blueprint.name);

      return true;
    } catch (error) {
      console.error('Error saving blueprint:', error);
      return false;
    }
  }

  /**
   * Load blueprint from storage
   */
  static async loadBlueprint(blueprintId: string): Promise<Blueprint | null> {
    try {
      const key = `${STORAGE_KEY_PREFIX}${blueprintId}`;
      const data = await AsyncStorage.getItem(key);

      if (!data) {
        return null;
      }

      const serialized: BlueprintSerializable = JSON.parse(data);
      const blueprint = Blueprint.import(JSON.stringify(serialized.blueprint));

      return blueprint;
    } catch (error) {
      console.error('Error loading blueprint:', error);
      return null;
    }
  }

  /**
   * Delete blueprint
   */
  static async deleteBlueprint(blueprintId: string): Promise<boolean> {
    try {
      const key = `${STORAGE_KEY_PREFIX}${blueprintId}`;
      await AsyncStorage.removeItem(key);
      await this.removeFromIndex(blueprintId);

      return true;
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      return false;
    }
  }

  /**
   * Get all blueprints metadata
   */
  static async getAllBlueprints(): Promise<Array<{ id: string; name: string; modified: Date }>> {
    try {
      const indexData = await AsyncStorage.getItem(BLUEPRINTS_INDEX_KEY);

      if (!indexData) {
        return [];
      }

      return JSON.parse(indexData);
    } catch (error) {
      console.error('Error getting blueprints:', error);
      return [];
    }
  }

  /**
   * Save version snapshot
   */
  static async saveVersion(blueprintId: string, version: BlueprintVersion): Promise<boolean> {
    try {
      const key = `${VERSIONS_PREFIX}${blueprintId}_${version.versionId}`;
      await AsyncStorage.setItem(key, JSON.stringify(version));

      return true;
    } catch (error) {
      console.error('Error saving version:', error);
      return false;
    }
  }

  /**
   * Load version snapshot
   */
  static async loadVersion(blueprintId: string, versionId: string): Promise<BlueprintVersion | null> {
    try {
      const key = `${VERSIONS_PREFIX}${blueprintId}_${versionId}`;
      const data = await AsyncStorage.getItem(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading version:', error);
      return null;
    }
  }

  /**
   * Get all versions for blueprint
   */
  static async getVersions(blueprintId: string): Promise<BlueprintVersion[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const versionKeys = allKeys.filter(
        (key) => key.startsWith(VERSIONS_PREFIX) && key.includes(blueprintId)
      );

      const versions: BlueprintVersion[] = [];

      for (const key of versionKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          versions.push(JSON.parse(data));
        }
      }

      return versions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error getting versions:', error);
      return [];
    }
  }

  /**
   * Save metadata
   */
  static async saveMetadata(blueprintId: string, metadata: BlueprintMetadata): Promise<boolean> {
    try {
      const key = `${METADATA_PREFIX}${blueprintId}`;
      await AsyncStorage.setItem(key, JSON.stringify(metadata));

      return true;
    } catch (error) {
      console.error('Error saving metadata:', error);
      return false;
    }
  }

  /**
   * Load metadata
   */
  static async loadMetadata(blueprintId: string): Promise<BlueprintMetadata | null> {
    try {
      const key = `${METADATA_PREFIX}${blueprintId}`;
      const data = await AsyncStorage.getItem(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading metadata:', error);
      return null;
    }
  }

  /**
   * Export blueprint as JSON
   */
  static async exportBlueprint(blueprint: Blueprint): Promise<string> {
    return blueprint.export();
  }

  /**
   * Import blueprint from JSON
   */
  static async importBlueprint(jsonData: string): Promise<Blueprint | null> {
    try {
      return Blueprint.import(jsonData);
    } catch (error) {
      console.error('Error importing blueprint:', error);
      return null;
    }
  }

  /**
   * Export blueprint as file
   */
  static async exportBlueprintAsFile(blueprint: Blueprint, filename: string): Promise<Blob> {
    const data = blueprint.export();
    return new Blob([data], { type: 'application/json' });
  }

  /**
   * Search blueprints
   */
  static async searchBlueprints(query: string): Promise<Blueprint[]> {
    try {
      const allBlueprints = await this.getAllBlueprints();
      const results: Blueprint[] = [];

      for (const item of allBlueprints) {
        if (
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.id.includes(query)
        ) {
          const blueprint = await this.loadBlueprint(item.id);
          if (blueprint) {
            results.push(blueprint);
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching blueprints:', error);
      return [];
    }
  }

  /**
   * Get blueprint statistics
   */
  static async getBlueprintStats(blueprintId: string): Promise<any> {
    try {
      const blueprint = await this.loadBlueprint(blueprintId);

      if (!blueprint) {
        return null;
      }

      return blueprint.getStatistics();
    } catch (error) {
      console.error('Error getting blueprint stats:', error);
      return null;
    }
  }

  /**
   * Validate blueprint integrity
   */
  static async validateBlueprint(blueprintId: string): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    try {
      const blueprint = await this.loadBlueprint(blueprintId);

      if (!blueprint) {
        return {
          isValid: false,
          errors: ['Blueprint not found'],
        };
      }

      return blueprint.validate();
    } catch (error) {
      console.error('Error validating blueprint:', error);
      return {
        isValid: false,
        errors: [String(error)],
      };
    }
  }

  /**
   * Duplicate blueprint
   */
  static async duplicateBlueprint(sourceId: string, newName: string): Promise<Blueprint | null> {
    try {
      const source = await this.loadBlueprint(sourceId);

      if (!source) {
        return null;
      }

      const newBlueprint = new Blueprint(this.generateId(), newName, source.parentClass);
      newBlueprint.description = source.description;
      newBlueprint.nodes = JSON.parse(JSON.stringify(source.nodes));
      newBlueprint.edges = JSON.parse(JSON.stringify(source.edges));
      newBlueprint.variables = JSON.parse(JSON.stringify(source.variables));
      newBlueprint.functions = JSON.parse(JSON.stringify(source.functions));
      newBlueprint.events = JSON.parse(JSON.stringify(source.events));

      await this.saveBlueprint(newBlueprint);

      return newBlueprint;
    } catch (error) {
      console.error('Error duplicating blueprint:', error);
      return null;
    }
  }

  /**
   * Clear all blueprints
   */
  static async clearAllBlueprints(): Promise<boolean> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const blueptintKeys = allKeys.filter((key) => key.startsWith(STORAGE_KEY_PREFIX));

      await AsyncStorage.multiRemove(blueptintKeys);
      await AsyncStorage.removeItem(BLUEPRINTS_INDEX_KEY);

      return true;
    } catch (error) {
      console.error('Error clearing blueprints:', error);
      return false;
    }
  }

  /**
   * Get storage size info
   */
  static async getStorageInfo(): Promise<{
    usedBytes: number;
    blueprintCount: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const blueprintKeys = allKeys.filter((key) => key.startsWith(STORAGE_KEY_PREFIX));

      let totalSize = 0;

      for (const key of blueprintKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          totalSize += data.length;
        }
      }

      return {
        usedBytes: totalSize,
        blueprintCount: blueprintKeys.length,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        usedBytes: 0,
        blueprintCount: 0,
      };
    }
  }

  /**
   * Update blueprint index
   */
  private static async updateBlueprintIndex(blueprintId: string, name: string): Promise<void> {
    try {
      const indexData = await AsyncStorage.getItem(BLUEPRINTS_INDEX_KEY);
      let index = indexData ? JSON.parse(indexData) : [];

      // Remove if exists
      index = index.filter((item: any) => item.id !== blueprintId);

      // Add new entry
      index.push({
        id: blueprintId,
        name,
        modified: new Date(),
      });

      await AsyncStorage.setItem(BLUEPRINTS_INDEX_KEY, JSON.stringify(index));
    } catch (error) {
      console.error('Error updating blueprint index:', error);
    }
  }

  /**
   * Remove from index
   */
  private static async removeFromIndex(blueprintId: string): Promise<void> {
    try {
      const indexData = await AsyncStorage.getItem(BLUEPRINTS_INDEX_KEY);
      if (indexData) {
        let index = JSON.parse(indexData);
        index = index.filter((item: any) => item.id !== blueprintId);
        await AsyncStorage.setItem(BLUEPRINTS_INDEX_KEY, JSON.stringify(index));
      }
    } catch (error) {
      console.error('Error removing from index:', error);
    }
  }

  /**
   * Generate hash
   */
  private static generateHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate ID
   */
  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
