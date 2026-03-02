import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  suggestNodesForContext,
  suggestConnectionsForNode,
  detectPatternAnomalies,
  NodeSuggestion,
} from '../../app/utils/ai-node-suggester';
import { nanoid } from '../../app/utils/id-generator';

export default function AINodeSuggester() {
  const [visible, setVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<NodeSuggestion[]>([]);
  const [anomalies, setAnomalies] = useState<
    { nodeId: string; issue: string; severity: 'low' | 'medium' | 'high' }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'nodes' | 'connections' | 'issues'>('nodes');

  const { nodes, edges, selectedNodeId, addNode } = useEditorStore();

  useEffect(() => {
    if (visible) {
      analyzeSuggestions();
    }
  }, [visible, selectedNodeId, nodes, edges]);

  const analyzeSuggestions = () => {
    setLoading(true);
    setTimeout(() => {
      const nodeSuggestions = suggestNodesForContext(nodes, edges, selectedNodeId);
      const detectedIssues = detectPatternAnomalies(nodes, edges);
      setSuggestions(nodeSuggestions);
      setAnomalies(detectedIssues);
      setLoading(false);
    }, 500);
  };

  const handleAddSuggestedNode = (suggestion: NodeSuggestion) => {
    try {
      const newNode: any = {
        id: nanoid(),
        label: suggestion.label,
        type: suggestion.type,
        position: { x: 200, y: 200 },
        color: suggestion.color,
        pins: [
          { id: nanoid(), name: 'in', type: 'exec', direction: 'input' },
          { id: nanoid(), name: 'out', type: 'exec', direction: 'output' },
        ],
        data: {},
      };
      addNode(newNode);
      Alert.alert('Success', `${suggestion.label} node added`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add node');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#3b82f6';
      default:
        return '#64748b';
    }
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="brain" size={20} color="#fff" />
        <Text style={styles.buttonText}>AI</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AI Node Suggester</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            <Pressable
              style={[
                styles.tab,
                activeTab === 'nodes' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('nodes')}
            >
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={18}
                color={activeTab === 'nodes' ? '#06b6d4' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'nodes' && styles.tabTextActive,
                ]}
              >
                Suggestions
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.tab,
                activeTab === 'connections' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('connections')}
            >
              <MaterialCommunityIcons
                name="link-variant"
                size={18}
                color={activeTab === 'connections' ? '#06b6d4' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'connections' && styles.tabTextActive,
                ]}
              >
                Connections
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.tab,
                activeTab === 'issues' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('issues')}
            >
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={18}
                color={activeTab === 'issues' ? '#06b6d4' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'issues' && styles.tabTextActive,
                ]}
              >
                Issues
              </Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#06b6d4" />
                <Text style={styles.loadingText}>Analyzing graph...</Text>
              </View>
            ) : (
              <>
                {/* Suggestions Tab */}
                {activeTab === 'nodes' && (
                  <View style={styles.section}>
                    {!selectedNodeId && (
                      <View style={styles.emptyStateBox}>
                        <MaterialCommunityIcons
                          name="information-outline"
                          size={24}
                          color="#f59e0b"
                        />
                        <Text style={styles.emptyStateText}>
                          Select a node to get suggestions
                        </Text>
                      </View>
                    )}

                    {selectedNodeId && suggestions.length === 0 && (
                      <View style={styles.emptyStateBox}>
                        <MaterialCommunityIcons
                          name="check-circle-outline"
                          size={24}
                          color="#10b981"
                        />
                        <Text style={styles.emptyStateText}>
                          No suggestions available
                        </Text>
                      </View>
                    )}

                    {suggestions.map((suggestion) => (
                      <View key={suggestion.id} style={styles.suggestionCard}>
                        <View style={styles.suggestionHeader}>
                          <MaterialCommunityIcons
                            name={suggestion.icon as any}
                            size={20}
                            color={suggestion.color}
                          />
                          <View style={styles.suggestionInfo}>
                            <Text style={styles.suggestionLabel}>
                              {suggestion.label}
                            </Text>
                            <Text style={styles.suggestionDesc}>
                              {suggestion.description}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.suggestionMeta}>
                          <View style={styles.reasonBadge}>
                            <Text style={styles.reasonText}>
                              {suggestion.reason}
                            </Text>
                          </View>
                          <View style={styles.confidenceBadge}>
                            <Text style={styles.confidenceText}>
                              {(suggestion.confidence * 100).toFixed(0)}%
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          style={styles.addButton}
                          onPress={() => handleAddSuggestedNode(suggestion)}
                        >
                          <MaterialCommunityIcons
                            name="plus-circle"
                            size={16}
                            color="#fff"
                          />
                          <Text style={styles.addButtonText}>Add Node</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}

                {/* Connections Tab */}
                {activeTab === 'connections' && (
                  <View style={styles.section}>
                    {!selectedNodeId ? (
                      <View style={styles.emptyStateBox}>
                        <MaterialCommunityIcons
                          name="information-outline"
                          size={24}
                          color="#f59e0b"
                        />
                        <Text style={styles.emptyStateText}>
                          Select a node to see connection suggestions
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.sectionTitle}>
                        Connection Recommendations
                      </Text>
                    )}
                  </View>
                )}

                {/* Issues Tab */}
                {activeTab === 'issues' && (
                  <View style={styles.section}>
                    {anomalies.length === 0 ? (
                      <View style={styles.emptyStateBox}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color="#10b981"
                        />
                        <Text style={styles.emptyStateText}>
                          No issues detected
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.sectionTitle}>
                          Issues Found ({anomalies.length})
                        </Text>
                        <FlatList
                          data={anomalies}
                          scrollEnabled={false}
                          renderItem={({ item }) => (
                            <View
                              style={[
                                styles.issueCard,
                                {
                                  borderLeftColor: getSeverityColor(item.severity),
                                },
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={20}
                                color={getSeverityColor(item.severity)}
                              />
                              <View style={styles.issueInfo}>
                                <Text style={styles.issueText}>
                                  {item.issue}
                                </Text>
                                <View style={styles.severityBadge}>
                                  <Text
                                    style={[
                                      styles.severityText,
                                      {
                                        color: getSeverityColor(item.severity),
                                      },
                                    ]}
                                  >
                                    {item.severity.toUpperCase()}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )}
                          keyExtractor={(item, idx) =>
                            item.nodeId + idx.toString()
                          }
                        />
                      </>
                    )}
                  </View>
                )}
              </>
            )}
          </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginTop: 40,
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#06b6d4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#06b6d4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 12,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  suggestionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  suggestionDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  suggestionMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reasonBadge: {
    flex: 1,
    backgroundColor: '#0c4a6e',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  reasonText: {
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: '500',
  },
  confidenceBadge: {
    backgroundColor: '#0c4a6e',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  confidenceText: {
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06b6d4',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
    gap: 10,
  },
  issueInfo: {
    flex: 1,
  },
  issueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 6,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
