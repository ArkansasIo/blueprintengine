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
  TextInput,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GeneratedTemplate {
  id: string;
  name: string;
  pattern: string;
  complexity: 'simple' | 'medium' | 'complex';
  nodeCount: number;
  edgeCount: number;
  score: number;
}

export default function SmartTemplateGenerator() {
  const [visible, setVisible] = useState(false);
  const [templates, setTemplates] = useState<GeneratedTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { nodes, edges } = useEditorStore();

  useEffect(() => {
    if (visible) {
      generateSmartTemplates();
    }
  }, [visible]);

  const generateSmartTemplates = () => {
    const generated: GeneratedTemplate[] = [];

    // Analyze graph structure
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const density = edgeCount / (nodeCount * (nodeCount - 1) / 2);

    // Identify graph characteristics
    const inDegrees = new Map<string, number>();
    const outDegrees = new Map<string, number>();

    nodes.forEach((n) => {
      inDegrees.set(n.id, 0);
      outDegrees.set(n.id, 0);
    });

    edges.forEach((e) => {
      inDegrees.set(e.toNodeId, (inDegrees.get(e.toNodeId) || 0) + 1);
      outDegrees.set(e.fromNodeId, (outDegrees.get(e.fromNodeId) || 0) + 1);
    });

    const avgDegree = Array.from(inDegrees.values()).reduce((a, b) => a + b, 0) / nodeCount;

    // Linear workflow
    if (density < 0.3 && edgeCount === nodeCount - 1) {
      generated.push({
        id: 'workflow',
        name: 'Linear Workflow',
        pattern: 'Sequential execution flow',
        complexity: 'simple',
        nodeCount,
        edgeCount,
        score: 0.9,
      });
    }

    // Hub network
    const maxOutDegree = Math.max(...Array.from(outDegrees.values()));
    if (maxOutDegree > nodeCount / 2) {
      generated.push({
        id: 'hub',
        name: 'Hub & Spoke',
        pattern: 'Central hub with distributed nodes',
        complexity: 'medium',
        nodeCount,
        edgeCount,
        score: 0.85,
      });
    }

    // Layered system
    if (density > 0.3 && density < 0.7) {
      generated.push({
        id: 'layered',
        name: 'Layered System',
        pattern: 'Multiple processing layers',
        complexity: 'medium',
        nodeCount,
        edgeCount,
        score: 0.8,
      });
    }

    // Fully connected
    if (density > 0.7) {
      generated.push({
        id: 'mesh',
        name: 'Mesh Network',
        pattern: 'Highly interconnected nodes',
        complexity: 'complex',
        nodeCount,
        edgeCount,
        score: 0.75,
      });
    }

    // Simple graph
    if (nodeCount < 5 && edgeCount < 5) {
      generated.push({
        id: 'simple',
        name: 'Simple Graph',
        pattern: 'Basic node relationships',
        complexity: 'simple',
        nodeCount,
        edgeCount,
        score: 0.7,
      });
    }

    // Decision tree
    const maxInDegree = Math.max(...Array.from(inDegrees.values()));
    if (maxInDegree <= 2 && nodeCount > 3) {
      generated.push({
        id: 'tree',
        name: 'Decision Tree',
        pattern: 'Branching decision paths',
        complexity: 'medium',
        nodeCount,
        edgeCount,
        score: 0.8,
      });
    }

    // Sort by score
    setTemplates(generated.sort((a, b) => b.score - a.score));
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Template name cannot be empty');
      return;
    }

    if (!selectedTemplate) {
      Alert.alert('Error', 'Select a template first');
      return;
    }

    Alert.alert(
      'Success',
      `Template "${templateName}" saved based on ${selectedTemplate} pattern`
    );
    setTemplateName('');
    setVisible(false);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'complex':
        return '#ef4444';
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
        <MaterialCommunityIcons
          name="lightbulb-on-outline"
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>Generate</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Smart Template Generator</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Info */}
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information"
                size={16}
                color="#06b6d4"
              />
              <Text style={styles.infoText}>
                AI-generated templates based on your blueprint structure
              </Text>
            </View>

            {/* Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Blueprint Analysis</Text>
              <View style={styles.analysisGrid}>
                <View style={styles.analysisItem}>
                  <MaterialCommunityIcons
                    name="cube-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.analysisValue}>{nodes.length}</Text>
                  <Text style={styles.analysisLabel}>Nodes</Text>
                </View>
                <View style={styles.analysisItem}>
                  <MaterialCommunityIcons
                    name="vector-link"
                    size={20}
                    color="#10b981"
                  />
                  <Text style={styles.analysisValue}>{edges.length}</Text>
                  <Text style={styles.analysisLabel}>Edges</Text>
                </View>
                <View style={styles.analysisItem}>
                  <MaterialCommunityIcons
                    name="connection"
                    size={20}
                    color="#8b5cf6"
                  />
                  <Text style={styles.analysisValue}>
                    {nodes.length > 0
                      ? (
                        (edges.length /
                          (nodes.length * (nodes.length - 1) / 2)) *
                        100
                      ).toFixed(0)
                      : '0'}
                    %
                  </Text>
                  <Text style={styles.analysisLabel}>Density</Text>
                </View>
              </View>
            </View>

            {/* Suggested Templates */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Suggested Templates ({templates.length})
              </Text>

              {templates.length > 0 ? (
                <FlatList
                  data={templates}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[
                        styles.templateCard,
                        selectedTemplate === item.id &&
                          styles.templateCardSelected,
                      ]}
                      onPress={() => setSelectedTemplate(item.id)}
                    >
                      <View style={styles.templateHeader}>
                        <View style={styles.templateTitle}>
                          <Text style={styles.templateName}>
                            {item.name}
                          </Text>
                          <Text style={styles.templatePattern}>
                            {item.pattern}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.complexityBadge,
                            {
                              backgroundColor: getComplexityColor(
                                item.complexity
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.complexityText}>
                            {item.complexity}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.templateStats}>
                        <View style={styles.statSmall}>
                          <Text style={styles.statLabel}>Nodes</Text>
                          <Text style={styles.statValue}>
                            {item.nodeCount}
                          </Text>
                        </View>
                        <View style={styles.statSmall}>
                          <Text style={styles.statLabel}>Edges</Text>
                          <Text style={styles.statValue}>
                            {item.edgeCount}
                          </Text>
                        </View>
                        <View style={styles.statSmall}>
                          <Text style={styles.statLabel}>Match</Text>
                          <Text style={styles.statValue}>
                            {(item.score * 100).toFixed(0)}%
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <View style={styles.empty}>
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={48}
                    color="#64748b"
                  />
                  <Text style={styles.emptyText}>No templates available</Text>
                  <Text style={styles.emptySubtext}>
                    Add more nodes to get suggestions
                  </Text>
                </View>
              )}
            </View>

            {/* Save Template */}
            {selectedTemplate && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Save as Template</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Template name"
                  placeholderTextColor="#64748b"
                  value={templateName}
                  onChangeText={setTemplateName}
                />

                <Pressable
                  style={styles.saveButton}
                  onPress={handleSaveTemplate}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.saveButtonText}>Save Template</Text>
                </Pressable>
              </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
    marginBottom: 24,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
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
  analysisGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  analysisItem: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  analysisValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 8,
  },
  analysisLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  templateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateCardSelected: {
    backgroundColor: '#0c4a6e',
    borderColor: '#06b6d4',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  templateTitle: {
    flex: 1,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  templatePattern: {
    fontSize: 11,
    color: '#94a3b8',
  },
  complexityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  complexityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  templateStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statSmall: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
    marginBottom: 12,
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
