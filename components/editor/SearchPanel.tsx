import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlueprintClass } from '@/app/utils/ue5-blueprint-generator';

interface SearchResult {
  type: 'node' | 'variable' | 'function' | 'event';
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface SearchPanelProps {
  blueprint: BlueprintClass | null;
  onNodeSelected: (nodeId: string) => void;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ blueprint, onNodeSelected, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results: SearchResult[] = useMemo(() => {
    if (!blueprint || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search nodes
    blueprint.eventGraphNodes.forEach((node) => {
      if (
        node.label.toLowerCase().includes(query) ||
        node.type.toLowerCase().includes(query)
      ) {
        searchResults.push({
          type: 'node',
          id: node.id,
          name: node.label,
          description: `Type: ${node.type}`,
          icon: 'cube-outline',
          color: '#3b82f6',
        });
      }
    });

    // Search variables
    blueprint.variables.forEach((variable) => {
      if (variable.name.toLowerCase().includes(query)) {
        searchResults.push({
          type: 'variable',
          id: variable.id,
          name: variable.name,
          description: `Type: ${variable.type} | Category: ${variable.category || 'Default'}`,
          icon: 'variable-box',
          color: '#8b5cf6',
        });
      }
    });

    // Search functions
    blueprint.functions.forEach((func) => {
      if (
        func.name.toLowerCase().includes(query) ||
        func.description?.toLowerCase().includes(query)
      ) {
        searchResults.push({
          type: 'function',
          id: func.id,
          name: func.name,
          description: func.description || 'Custom function',
          icon: 'function',
          color: '#3b82f6',
        });
      }
    });

    // Search events
    blueprint.events.forEach((event) => {
      if (event.name.toLowerCase().includes(query)) {
        searchResults.push({
          type: 'event',
          id: event.id,
          name: event.name,
          description: event.description || 'Custom event',
          icon: 'lightning-bolt',
          color: '#ef4444',
        });
      }
    });

    return searchResults;
  }, [blueprint, searchQuery]);

  const handleSelectResult = (result: SearchResult) => {
    if (result.type === 'node') {
      onNodeSelected(result.id);
      onClose();
    }
  };

  const handleKeyDown = (key: string) => {
    if (key === 'ArrowDown') {
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (key === 'ArrowUp') {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (key === 'Escape') {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      {/* Overlay backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Search Panel */}
      <View style={styles.panel}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="magnify" size={16} color="#06b6d4" />
          <Text style={styles.title}>Search</Text>
          <Pressable onPress={onClose}>
            <MaterialCommunityIcons name="close" size={16} color="#cbd5e1" />
          </Pressable>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search nodes, variables, functions..."
            placeholderTextColor="#475569"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        {/* Results */}
        <ScrollView style={styles.results}>
          {results.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={32}
                color="#475569"
              />
              <Text style={styles.emptyText}>
                {searchQuery.length === 0
                  ? 'Start typing to search'
                  : 'No results found'}
              </Text>
            </View>
          ) : (
            results.map((result, idx) => (
              <Pressable
                key={result.id}
                style={[
                  styles.resultItem,
                  idx === selectedIndex && styles.resultItemSelected,
                ]}
                onPress={() => handleSelectResult(result)}
              >
                <View
                  style={[
                    styles.resultIcon,
                    { backgroundColor: result.color + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={result.icon}
                    size={14}
                    color={result.color}
                  />
                </View>

                <View style={styles.resultInfo}>
                  <View style={styles.resultNameRow}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    <Text style={styles.resultTypeTag}>{result.type}</Text>
                  </View>
                  <Text style={styles.resultDescription} numberOfLines={1}>
                    {result.description}
                  </Text>
                </View>

                {result.type === 'node' && (
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={14}
                    color="#475569"
                  />
                )}
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerHint}>
            <Text style={styles.hintText}>
              {results.length > 0 ? '↑ ↓ to navigate' : ''} ESC to close
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingTop: 60,
    zIndex: 1000,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  panel: {
    maxHeight: 500,
    marginHorizontal: 40,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    zIndex: 1001,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  searchInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#e2e8f0',
    fontSize: 12,
  },

  results: {
    maxHeight: 350,
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },

  emptyText: {
    fontSize: 12,
    color: '#64748b',
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.5)',
    gap: 8,
  },

  resultItemSelected: {
    backgroundColor: '#0c4a6e',
  },

  resultIcon: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultInfo: {
    flex: 1,
  },

  resultNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  resultName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#cbd5e1',
    flex: 1,
  },

  resultTypeTag: {
    fontSize: 8,
    color: '#64748b',
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  resultDescription: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },

  footer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0f172a',
  },

  footerHint: {
    alignItems: 'center',
  },

  hintText: {
    fontSize: 10,
    color: '#64748b',
  },
});

export default SearchPanel;
