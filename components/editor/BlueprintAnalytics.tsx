import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { validateBlueprint } from '../../app/utils/blueprint-validator';

interface Metric {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function BlueprintAnalytics() {
  const [visible, setVisible] = useState(false);
  const { nodes, edges } = useEditorStore();

  const analytics = useMemo(() => {
    const validation = validateBlueprint({ nodes, edges } as any);
    
    const inputNodes = nodes.filter((n) => n.type === 'input').length;
    const outputNodes = nodes.filter((n) => n.type === 'output').length;
    const logicNodes = nodes.filter((n) => n.type === 'logic').length;
    
    // Calculate depth (longest path)
    const calculateDepth = (): number => {
      if (nodes.length === 0) return 0;
      
      const visited = new Set<string>();
      let maxDepth = 0;

      const dfs = (nodeId: string, depth: number): void => {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        maxDepth = Math.max(maxDepth, depth);

        const outgoing = edges.filter((e) => e.fromNodeId === nodeId);
        outgoing.forEach((e) => dfs(e.toNodeId, depth + 1));
      };

      nodes.forEach((n) => dfs(n.id, 1));
      return maxDepth;
    };

    const depth = calculateDepth();
    const totalPins = nodes.reduce((sum, n) => sum + n.pins.length, 0);
    
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      inputCount: inputNodes,
      outputCount: outputNodes,
      logicCount: logicNodes,
      depth,
      totalPins,
      isValid: validation.valid,
      errors: validation.errors,
    };
  }, [nodes, edges]);

  const metrics: Metric[] = [
    {
      label: 'Total Nodes',
      value: analytics.nodeCount,
      icon: 'cube-outline',
      color: '#3b82f6',
    },
    {
      label: 'Total Edges',
      value: analytics.edgeCount,
      icon: 'vector-link',
      color: '#10b981',
    },
    {
      label: 'Input Nodes',
      value: analytics.inputCount,
      icon: 'arrow-left-circle',
      color: '#06b6d4',
    },
    {
      label: 'Output Nodes',
      value: analytics.outputCount,
      icon: 'arrow-right-circle',
      color: '#f59e0b',
    },
    {
      label: 'Logic Nodes',
      value: analytics.logicCount,
      icon: 'flash-circle',
      color: '#ec4899',
    },
    {
      label: 'Graph Depth',
      value: analytics.depth,
      icon: 'layers-outline',
      color: '#8b5cf6',
    },
    {
      label: 'Total Pins',
      value: analytics.totalPins,
      icon: 'connection',
      color: '#06b6d4',
    },
  ];

  return (
    <>
      <Pressable
        style={[
          styles.button,
          !analytics.isValid && styles.buttonWarning,
        ]}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name="chart-box-outline"
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>Stats</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Blueprint Analytics</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Validation Status */}
            <View style={styles.section}>
              <View
                style={[
                  styles.statusCard,
                  analytics.isValid
                    ? styles.statusValid
                    : styles.statusInvalid,
                ]}
              >
                <MaterialCommunityIcons
                  name={analytics.isValid ? 'check-circle' : 'alert-circle'}
                  size={24}
                  color={analytics.isValid ? '#10b981' : '#ef4444'}
                />
                <View style={styles.statusContent}>
                  <Text style={styles.statusTitle}>
                    {analytics.isValid ? 'Valid Blueprint' : 'Issues Found'}
                  </Text>
                  <Text style={styles.statusDescription}>
                    {analytics.isValid
                      ? 'No validation errors detected'
                      : `${analytics.errors?.length || 0} error(s) found`}
                  </Text>
                </View>
              </View>

              {!analytics.isValid && analytics.errors && analytics.errors.length > 0 && (
                <View style={styles.errorList}>
                  {analytics.errors.slice(0, 5).map((error: any, idx: number) => (
                    <View key={idx} style={styles.errorItem}>
                      <MaterialCommunityIcons
                        name="alert"
                        size={16}
                        color="#ef4444"
                      />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Metrics Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Metrics</Text>
              <View style={styles.metricsGrid}>
                {metrics.map((metric, idx) => (
                  <View key={idx} style={styles.metricCard}>
                    <View
                      style={[
                        styles.metricIcon,
                        { backgroundColor: metric.color + '20' },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={metric.icon as any}
                        size={20}
                        color={metric.color}
                      />
                    </View>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Performance Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Notes</Text>
              <View style={styles.noteCard}>
                <MaterialCommunityIcons
                  name="information"
                  size={16}
                  color="#06b6d4"
                />
                <Text style={styles.noteText}>
                  {analytics.nodeCount > 50
                    ? 'Large graph detected. Consider breaking into smaller blueprints.'
                    : analytics.depth > 10
                    ? 'Deep nesting detected. Consider refactoring logic flow.'
                    : 'Graph structure looks optimal.'}
                </Text>
              </View>
            </View>
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
  buttonWarning: {
    borderColor: '#ef4444',
    backgroundColor: '#7f1d1d',
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  statusValid: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  statusInvalid: {
    borderColor: '#ef4444',
    backgroundColor: '#7f1d1d',
  },
  statusContent: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  errorList: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#fecaca',
    marginLeft: 8,
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0c4a6e',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
  },
  noteText: {
    fontSize: 12,
    color: '#cbd5e1',
    marginLeft: 10,
    flex: 1,
  },
});