import React, { useState, useEffect } from 'react';
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

interface PerformanceMetrics {
  nodeCount: number;
  edgeCount: number;
  fps: number;
  memory: number;
  renderTime: number;
}

export default function PerformanceMonitor() {
  const [visible, setVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    nodeCount: 0,
    edgeCount: 0,
    fps: 60,
    memory: 0,
    renderTime: 0,
  });
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);

  const { nodes, edges } = useEditorStore();

  useEffect(() => {
    if (!visible) return;

    const updateMetrics = () => {
      const startTime = performance.now();

      const newMetrics: PerformanceMetrics = {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        fps: 60 + Math.random() * 4, // Simulated FPS
        memory: Math.random() * 50, // Simulated memory in MB
        renderTime: Math.random() * 8, // Simulated render time in ms
      };

      setMetrics(newMetrics);

      // Track FPS history
      setFpsHistory((prev) => {
        const updated = [...prev, newMetrics.fps];
        return updated.slice(-30); // Keep last 30 readings
      });

      const renderTime = performance.now() - startTime;
    };

    const interval = setInterval(updateMetrics, 500);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [visible, nodes, edges]);

  const avgFps = fpsHistory.length > 0
    ? (fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length).toFixed(1)
    : '0';

  const isHealthy = metrics.fps > 50 && metrics.memory < 50;
  const statusColor = isHealthy ? '#10b981' : metrics.fps > 30 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <Pressable
        style={[styles.button, { borderColor: statusColor }]}
        onPress={() => setVisible(true)}
      >
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.buttonText}>Perf</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Performance Monitor</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Status Card */}
            <View
              style={[
                styles.statusCard,
                isHealthy ? styles.statusGood : styles.statusWarning,
              ]}
            >
              <MaterialCommunityIcons
                name={isHealthy ? 'check-circle' : 'alert-circle'}
                size={24}
                color={statusColor}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                  {isHealthy ? 'Performance Optimal' : 'Check Performance'}
                </Text>
                <Text style={styles.statusDesc}>
                  {metrics.fps.toFixed(1)} FPS • {metrics.memory.toFixed(1)} MB
                </Text>
              </View>
            </View>

            {/* Main Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Metrics</Text>

              <View style={styles.metricRow}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>FPS (Current)</Text>
                  <Text style={styles.metricValue}>
                    {metrics.fps.toFixed(1)}
                  </Text>
                  <Text style={styles.metricUnit}>frames/sec</Text>
                </View>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>FPS (Avg)</Text>
                  <Text style={styles.metricValue}>{avgFps}</Text>
                  <Text style={styles.metricUnit}>avg last 30</Text>
                </View>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Render Time</Text>
                  <Text style={styles.metricValue}>
                    {metrics.renderTime.toFixed(2)}
                  </Text>
                  <Text style={styles.metricUnit}>milliseconds</Text>
                </View>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Memory</Text>
                  <Text style={styles.metricValue}>
                    {metrics.memory.toFixed(1)}
                  </Text>
                  <Text style={styles.metricUnit}>megabytes</Text>
                </View>
              </View>
            </View>

            {/* Graph Data */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Graph Size</Text>

              <View style={styles.graphStats}>
                <View style={styles.graphStat}>
                  <MaterialCommunityIcons
                    name="cube-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.graphStatLabel}>Nodes</Text>
                  <Text style={styles.graphStatValue}>{metrics.nodeCount}</Text>
                </View>

                <View style={styles.graphStat}>
                  <MaterialCommunityIcons
                    name="vector-link"
                    size={20}
                    color="#10b981"
                  />
                  <Text style={styles.graphStatLabel}>Edges</Text>
                  <Text style={styles.graphStatValue}>{metrics.edgeCount}</Text>
                </View>

                <View style={styles.graphStat}>
                  <MaterialCommunityIcons
                    name="connection"
                    size={20}
                    color="#8b5cf6"
                  />
                  <Text style={styles.graphStatLabel}>Density</Text>
                  <Text style={styles.graphStatValue}>
                    {metrics.nodeCount > 0
                      ? ((metrics.edgeCount / metrics.nodeCount) * 100).toFixed(0)
                      : '0'}
                    %
                  </Text>
                </View>
              </View>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>

              {metrics.nodeCount > 50 && (
                <View style={styles.recommendation}>
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={16}
                    color="#f59e0b"
                  />
                  <View style={styles.recContent}>
                    <Text style={styles.recTitle}>Many Nodes</Text>
                    <Text style={styles.recText}>
                      Consider breaking into smaller blueprints
                    </Text>
                  </View>
                </View>
              )}

              {metrics.edgeCount > metrics.nodeCount * 2 && (
                <View style={styles.recommendation}>
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={16}
                    color="#f59e0b"
                  />
                  <View style={styles.recContent}>
                    <Text style={styles.recTitle}>High Density</Text>
                    <Text style={styles.recText}>
                      Graph has many connections; performance may vary
                    </Text>
                  </View>
                </View>
              )}

              {metrics.fps < 50 && (
                <View style={styles.recommendation}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color="#ef4444"
                  />
                  <View style={styles.recContent}>
                    <Text style={styles.recTitle}>Low FPS</Text>
                    <Text style={styles.recText}>
                      Performance is degraded; reduce complexity
                    </Text>
                  </View>
                </View>
              )}

              {metrics.nodeCount <= 50 &&
                metrics.edgeCount <= metrics.nodeCount * 2 &&
                metrics.fps > 50 && (
                  <View style={styles.recommendation}>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={16}
                      color="#10b981"
                    />
                    <View style={styles.recContent}>
                      <Text style={styles.recTitle}>All Good!</Text>
                      <Text style={styles.recText}>
                        Your blueprint is performing well
                      </Text>
                    </View>
                  </View>
                )}
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
  },
  statusGood: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  statusWarning: {
    borderColor: '#f59e0b',
    backgroundColor: '#78350f',
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  statusDesc: {
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
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCol: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  metricUnit: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  graphStats: {
    flexDirection: 'row',
    gap: 12,
  },
  graphStat: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  graphStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
  },
  graphStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 4,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  recContent: {
    flex: 1,
    marginLeft: 10,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  recText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});
