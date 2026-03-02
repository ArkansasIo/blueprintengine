import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Text, TextInput, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';

interface SearchResult {
  id: string;
  type: 'node' | 'property' | 'connection';
  name: string;
  context: string;
  lineNumber: number;
}

export default function SearchReplacePanel() {
  const [visible, setVisible] = useState(false);
  const [searchMode, setSearchMode] = useState<'search' | 'replace'>('search');
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const { nodes, updateNode } = useEditorStore();

  const handleSearch = () => {
    if (!searchText.trim()) return;

    // Search in nodes by label and other properties
    const searchResults: SearchResult[] = [];
    nodes.forEach((node, idx) => {
      const nodeLabel = (node as any).label || '';
      const nodeType = (node as any).type || '';
      const nodeData = JSON.stringify((node as any).data || {});

      const searchPattern = useRegex
        ? new RegExp(searchText, caseSensitive ? 'g' : 'gi')
        : null;

      const matches = (text: string) => {
        if (!text) return false;
        if (searchPattern) return searchPattern.test(text);
        if (matchWholeWord) {
          return caseSensitive
            ? text === searchText
            : text.toLowerCase() === searchText.toLowerCase();
        }
        return caseSensitive
          ? text.includes(searchText)
          : text.toLowerCase().includes(searchText.toLowerCase());
      };

      if (matches(nodeLabel) || matches(nodeType) || matches(nodeData)) {
        searchResults.push({
          id: node.id,
          type: 'node',
          name: nodeLabel || nodeType,
          context: `Node at (${node.position.x}, ${node.position.y})`,
          lineNumber: idx + 1,
        });
      }
    });

    setResults(searchResults);
  };

  const handleReplace = () => {
    if (!replaceText.trim() || results.length === 0) return;
    const firstResult = results[0];
    const node = nodes.find((n) => n.id === firstResult.id);

    if (node && firstResult.type === 'node') {
      updateNode(node.id, {
        ...node,
        label: (node as any).label?.replace(searchText, replaceText) || '',
      });
      setResults(results.slice(1));
    }
  };

  const handleReplaceAll = () => {
    if (!replaceText.trim() || results.length === 0) return;
    let replacedCount = 0;

    results.forEach((result) => {
      const node = nodes.find((n) => n.id === result.id);
      if (node && result.type === 'node') {
        const oldLabel = (node as any).label || '';
        const newLabel = oldLabel.replace(
          new RegExp(searchText, 'g'),
          replaceText
        );
        if (newLabel !== oldLabel) {
          updateNode(node.id, { ...node, label: newLabel });
          replacedCount++;
        }
      }
    });

    setResults([]);
    console.log(`Replaced ${replacedCount} occurrences`);
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="find-replace" size={18} color="#fff" />
        <Text style={styles.buttonText}>Find</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Find & Replace</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Mode Tabs */}
          <View style={styles.modeBar}>
            <Pressable
              style={[styles.modeTab, searchMode === 'search' && styles.modeTabActive]}
              onPress={() => setSearchMode('search')}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={14}
                color={searchMode === 'search' ? '#06b6d4' : '#64748b'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  searchMode === 'search' && styles.modeTabTextActive,
                ]}
              >
                Find
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modeTab, searchMode === 'replace' && styles.modeTabActive]}
              onPress={() => setSearchMode('replace')}
            >
              <MaterialCommunityIcons
                name="find-replace"
                size={14}
                color={searchMode === 'replace' ? '#06b6d4' : '#64748b'}
              />
              <Text
                style={[
                  styles.modeTabText,
                  searchMode === 'replace' && styles.modeTabTextActive,
                ]}
              >
                Replace
              </Text>
            </Pressable>
          </View>

          {/* Search Input */}
          <View style={styles.searchSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Find</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="magnify" size={14} color="#64748b" />
                <TextInput
                  style={styles.input}
                  placeholder="Search for..."
                  placeholderTextColor="#64748b"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {searchText && (
                  <Pressable onPress={() => setSearchText('')}>
                    <MaterialCommunityIcons name="close" size={14} color="#64748b" />
                  </Pressable>
                )}
              </View>
            </View>

            {searchMode === 'replace' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Replace</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="swap-horizontal" size={14} color="#64748b" />
                  <TextInput
                    style={styles.input}
                    placeholder="Replace with..."
                    placeholderTextColor="#64748b"
                    value={replaceText}
                    onChangeText={setReplaceText}
                  />
                </View>
              </View>
            )}

            {/* Search Options */}
            <View style={styles.optionsGrid}>
              <Pressable
                style={styles.optionButton}
                onPress={() => setCaseSensitive(!caseSensitive)}
              >
                <Switch
                  value={caseSensitive}
                  onValueChange={setCaseSensitive}
                  thumbColor="#06b6d4"
                />
                <Text style={styles.optionLabel}>Case Sensitive</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => setMatchWholeWord(!matchWholeWord)}
              >
                <Switch
                  value={matchWholeWord}
                  onValueChange={setMatchWholeWord}
                  thumbColor="#06b6d4"
                />
                <Text style={styles.optionLabel}>Whole Word</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => setUseRegex(!useRegex)}
              >
                <Switch
                  value={useRegex}
                  onValueChange={setUseRegex}
                  thumbColor="#06b6d4"
                />
                <Text style={styles.optionLabel}>Regex</Text>
              </Pressable>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.findButton}
                onPress={handleSearch}
              >
                <MaterialCommunityIcons name="magnify" size={14} color="#fff" />
                <Text style={styles.findButtonText}>Find All</Text>
              </Pressable>

              {searchMode === 'replace' && (
                <>
                  <Pressable
                    style={[styles.findButton, styles.replaceButton]}
                    onPress={handleReplace}
                  >
                    <MaterialCommunityIcons name="swap-horizontal" size={14} color="#fff" />
                    <Text style={styles.findButtonText}>Replace</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.findButton, styles.replaceAllButton]}
                    onPress={handleReplaceAll}
                  >
                    <MaterialCommunityIcons name="swap-horizontal" size={14} color="#fff" />
                    <Text style={styles.findButtonText}>Replace All</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {/* Results */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {results.length > 0 ? `${results.length} match(es) found` : 'No matches'}
              </Text>
            </View>

            <ScrollView style={styles.resultsList}>
              {results.map((result) => (
                <Pressable key={result.id} style={styles.resultItem}>
                  <View style={styles.resultIcon}>
                    <MaterialCommunityIcons
                      name={
                        result.type === 'node'
                          ? 'cube'
                          : result.type === 'property'
                          ? 'variable-box'
                          : 'connection'
                      }
                      size={14}
                      color={
                        result.type === 'node'
                          ? '#3b82f6'
                          : result.type === 'property'
                          ? '#06b6d4'
                          : '#10b981'
                      }
                    />
                  </View>

                  <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    <Text style={styles.resultContext}>{result.context}</Text>
                  </View>

                  <Text style={styles.resultLine}>:{result.lineNumber}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#64748b',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  modal: {
    flex: 1,
    backgroundColor: '#0f172a',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#94a3b8',
  },
  modeBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modeTabActive: {
    borderBottomColor: '#06b6d4',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  modeTabTextActive: {
    color: '#06b6d4',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    gap: 6,
  },
  optionLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  findButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    gap: 6,
  },
  replaceButton: {
    backgroundColor: '#f59e0b',
  },
  replaceAllButton: {
    backgroundColor: '#ef4444',
  },
  findButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  resultsSection: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  resultsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    gap: 10,
  },
  resultIcon: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  resultContext: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  resultLine: {
    fontSize: 10,
    color: '#64748b',
  },
});
