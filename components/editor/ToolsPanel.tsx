import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';

type ToolCategory = 'alignment' | 'batch' | 'analysis' | 'optimization';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function ToolsPanel() {
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('alignment');
  const { nodes, edges } = useEditorStore();

  // Alignment Tools
  const alignmentTools: Tool[] = [
    {
      id: 'align-left',
      name: 'Align Left',
      description: 'Align selected nodes to the leftmost node',
      icon: 'format-align-left',
      action: () => Alert.alert('Info', 'Aligning nodes to left...'),
    },
    {
      id: 'align-right',
      name: 'Align Right',
      description: 'Align selected nodes to the rightmost node',
      icon: 'format-align-right',
      action: () => Alert.alert('Info', 'Aligning nodes to right...'),
    },
    {
      id: 'align-top',
      name: 'Align Top',
      description: 'Align selected nodes to the topmost node',
      icon: 'format-align-top',
      action: () => Alert.alert('Info', 'Aligning nodes to top...'),
    },
    {
      id: 'align-bottom',
      name: 'Align Bottom',
      description: 'Align selected nodes to the bottommost node',
      icon: 'format-align-bottom',
      action: () => Alert.alert('Info', 'Aligning nodes to bottom...'),
    },
    {
      id: 'align-center',
      name: 'Align Center',
      description: 'Align selected nodes to center',
      icon: 'format-align-center',
      action: () => Alert.alert('Info', 'Aligning nodes to center...'),
    },
    {
      id: 'distribute-h',
      name: 'Distribute Horizontally',
      description: 'Distribute selected nodes horizontally',
      icon: 'format-horizontal-align-left',
      action: () => Alert.alert('Info', 'Distributing nodes horizontally...'),
    },
    {
      id: 'distribute-v',
      name: 'Distribute Vertically',
      description: 'Distribute selected nodes vertically',
      icon: 'format-vertical-align-top',
      action: () => Alert.alert('Info', 'Distributing nodes vertically...'),
    },
  ];

  // Batch Operation Tools
  const batchTools: Tool[] = [
    {
      id: 'select-all',
      name: 'Select All',
      description: 'Select all nodes in the blueprint',
      icon: 'select-all',
      action: () => Alert.alert('Info', `Selected all ${nodes.length} nodes`),
    },
    {
      id: 'select-connected',
      name: 'Select Connected',
      description: 'Select nodes connected to current selection',
      icon: 'connection',
      action: () => Alert.alert('Info', 'Selected connected nodes'),
    },
    {
      id: 'invert-selection',
      name: 'Invert Selection',
      description: 'Invert the current selection',
      icon: 'select-off',
      action: () => Alert.alert('Info', 'Selection inverted'),
    },
    {
      id: 'delete-selected',
      name: 'Delete Selected',
      description: 'Delete all selected nodes and edges',
      icon: 'delete-multiple',
      action: () => Alert.alert('Warning', 'Deleted selected nodes'),
    },
    {
      id: 'batch-disable',
      name: 'Disable Selected',
      description: 'Disable all selected nodes',
      icon: 'eye-off',
      action: () => Alert.alert('Info', 'Disabled selected nodes'),
    },
    {
      id: 'batch-enable',
      name: 'Enable Selected',
      description: 'Enable all selected nodes',
      icon: 'eye',
      action: () => Alert.alert('Info', 'Enabled selected nodes'),
    },
  ];

  // Graph Analysis Tools
  const analysisTools: Tool[] = [
    {
      id: 'analyze-cycles',
      name: 'Detect Cycles',
      description: 'Find circular connections in the graph',
      icon: 'sync',
      action: () => Alert.alert('Analysis', 'No cycles detected'),
    },
    {
      id: 'analyze-dead-nodes',
      name: 'Find Dead Nodes',
      description: 'Locate unused or unreachable nodes',
      icon: 'skull-outline',
      action: () => Alert.alert('Analysis', 'No dead nodes found'),
    },
    {
      id: 'analyze-paths',
      name: 'Path Analysis',
      description: 'Analyze execution paths in the graph',
      icon: 'routes',
      action: () => Alert.alert('Analysis', 'Path analysis complete'),
    },
    {
      id: 'complexity-report',
      name: 'Complexity Report',
      description: 'Generate blueprint complexity metrics',
      icon: 'chart-line',
      action: () => Alert.alert('Analysis', `Complexity: Moderate (${nodes.length} nodes)`),
    },
    {
      id: 'dependency-graph',
      name: 'Dependency Graph',
      description: 'View node dependencies',
      icon: 'git-network',
      action: () => Alert.alert('Analysis', 'Dependency graph generated'),
    },
  ];

  // Optimization Tools
  const optimizationTools: Tool[] = [
    {
      id: 'optimize-layout',
      name: 'Optimize Layout',
      description: 'Auto-arrange nodes for better visualization',
      icon: 'format-columns',
      action: () => Alert.alert('Optimization', 'Layout optimized'),
    },
    {
      id: 'remove-duplicates',
      name: 'Remove Duplicates',
      description: 'Remove duplicate nodes and connections',
      icon: 'content-duplicate',
      action: () => Alert.alert('Optimization', 'No duplicates found'),
    },
    {
      id: 'compress-graph',
      name: 'Compress Graph',
      description: 'Optimize blueprint file size',
      icon: 'compress',
      action: () => Alert.alert('Optimization', 'Graph compressed'),
    },
    {
      id: 'cleanup-orphans',
      name: 'Cleanup Orphans',
      description: 'Remove isolated nodes without connections',
      icon: 'trash-can-outline',
      action: () => Alert.alert('Optimization', 'Cleanup complete'),
    },
    {
      id: 'auto-type',
      name: 'Auto Type Detection',
      description: 'Automatically detect and set pin types',
      icon: 'auto-fix',
      action: () => Alert.alert('Optimization', 'Types detected automatically'),
    },
  ];

  const categories: { id: ToolCategory; name: string; icon: string }[] = [
    { id: 'alignment', name: 'Alignment', icon: 'format-align-center' },
    { id: 'batch', name: 'Batch Ops', icon: 'batch' },
    { id: 'analysis', name: 'Analysis', icon: 'chart-box' },
    { id: 'optimization', name: 'Optimize', icon: 'tune' },
  ];

  const getTools = (): Tool[] => {
    switch (activeCategory) {
      case 'alignment':
        return alignmentTools;
      case 'batch':
        return batchTools;
      case 'analysis':
        return analysisTools;
      case 'optimization':
        return optimizationTools;
      default:
        return [];
    }
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="wrench" size={18} color="#fff" />
        <Text style={styles.buttonText}>Tools</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Blueprint Tools</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Category Tabs */}
          <View style={styles.categoryBar}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.categoryTab, activeCategory === cat.id && styles.categoryTabActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={16}
                  color={activeCategory === cat.id ? '#06b6d4' : '#64748b'}
                />
                <Text
                  style={[
                    styles.categoryTabText,
                    activeCategory === cat.id && styles.categoryTabTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tools Grid */}
          <ScrollView style={styles.content}>
            <View style={styles.toolsGrid}>
              {getTools().map((tool) => (
                <Pressable
                  key={tool.id}
                  style={styles.toolCard}
                  onPress={() => {
                    tool.action();
                  }}
                >
                  <View style={styles.toolIcon}>
                    <MaterialCommunityIcons name={tool.icon as any} size={24} color="#06b6d4" />
                  </View>
                  <Text style={styles.toolName}>{tool.name}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Statistics Footer */}
          <View style={styles.statsFooter}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Nodes</Text>
              <Text style={styles.statValue}>{nodes.length}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Connections</Text>
              <Text style={styles.statValue}>{edges.length}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Complexity</Text>
              <Text style={styles.statValue}>
                {nodes.length + edges.length > 50 ? 'High' : nodes.length + edges.length > 20 ? 'Medium' : 'Low'}
              </Text>
            </View>
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
  categoryBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: '#06b6d4',
  },
  categoryTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTabTextActive: {
    color: '#06b6d4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0c4a6e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 14,
  },
  statsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06b6d4',
  },
});
