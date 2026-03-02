import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  threshold?: number;
}

interface ExecutionProfile {
  nodeName: string;
  executionTime: number;
  percentage: number;
}

export default function PerformanceMonitorPanel() {
  const [visible, setVisible] = useState(false);
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(45);
  const [executionTime, setExecutionTime] = useState(2.34);
  const [nodeCount, setNodeCount] = useState(24);
  const [complexity, setComplexity] = useState(68);
  const [profiles, setProfiles] = useState<ExecutionProfile[]>([
    { nodeName: 'Branch Node', executionTime: 0.85, percentage: 36 },
    { nodeName: 'Math Operations', executionTime: 0.62, percentage: 26 },
    { nodeName: 'String Concat', executionTime: 0.47, percentage: 20 },
    { nodeName: 'Array Access', executionTime: 0.40, percentage: 17 },
  ]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 20) + 50);
      setMemory(Math.floor(Math.random() * 30) + 30);
      setExecutionTime(parseFloat((Math.random() * 3 + 1).toFixed(2)));
      setComplexity(Math.floor(Math.random() * 40) + 50);
    }, 2000);

    return () => clearInterval(interval);
  }, [visible]);

  const metrics: PerformanceMetric[] = [
    {
      label: 'FPS',
      value: fps,
      unit: 'fps',
      icon: 'speedometer',
      color: fps > 50 ? '#10b981' : fps > 30 ? '#f59e0b' : '#ef4444',
      threshold: 60,
    },
    {
      label: 'Memory',
      value: memory,
      unit: 'MB',
      icon: 'chip',
      color: memory > 70 ? '#ef4444' : memory > 50 ? '#f59e0b' : '#10b981',
    },
    {
      label: 'Execution Time',
      value: executionTime,
      unit: 'ms',
      icon: 'clock-outline',
      color: executionTime > 3 ? '#ef4444' : executionTime > 1 ? '#f59e0b' : '#10b981',
    },
    {
      label: 'Nodes',
      value: nodeCount,
      unit: 'count',
      icon: 'cube-outline',
      color: '#06b6d4',
    },
  ];

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(!visible)}>
        <MaterialCommunityIcons name="speedometer" size={18} color="#fff" />
        <Text style={styles.buttonText}>{visible ? 'Close' : 'Monitor'}</Text>
      </Pressable>

      {visible && (
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Performance Monitor</Text>
            <Pressable onPress={() => setVisible(false)}>
              <MaterialCommunityIcons name="close" size={18} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
              {metrics.map((metric, idx) => (
                <View key={idx} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <MaterialCommunityIcons
                      name={metric.icon as any}
                      size={16}
                      color={metric.color}
                    />
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                  <View style={styles.metricValue}>
                    <Text style={[styles.metricNumber, { color: metric.color }]}>
                      {metric.value}
                    </Text>
                    <Text style={styles.metricUnit}>{metric.unit}</Text>
                  </View>
                  <View style={styles.metricBar}>
                    <View
                      style={[
                        styles.metricBarFill,
                        {
                          width: `${Math.min((metric.value / (metric.threshold || 100)) * 100, 100)}%`,
                          backgroundColor: metric.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Execution Profiling */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Execution Profiling</Text>

              {profiles.map((profile, idx) => (
                <View key={idx} style={styles.profileItem}>
                  <View style={styles.profileHeader}>
                    <Text style={styles.profileName}>{profile.nodeName}</Text>
                    <Text style={styles.profileTime}>{profile.executionTime}ms</Text>
                  </View>
                  <View style={styles.profileBar}>
                    <View
                      style={[
                        styles.profileBarFill,
                        {
                          width: `${profile.percentage}%`,
                          backgroundColor: '#3b82f6',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.profilePercentage}>{profile.percentage}%</Text>
                </View>
              ))}
            </View>

            {/* Blueprint Complexity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Blueprint Complexity</Text>

              <View style={styles.complexityBox}>
                <View style={styles.complexityMeter}>
                  <View style={styles.complexityLabel}>
                    <Text style={styles.complexityValue}>{complexity}%</Text>
                  </View>
                  <View
                    style={[
                      styles.complexityFill,
                      {
                        width: `${complexity}%`,
                        backgroundColor:
                          complexity > 75
                            ? '#ef4444'
                            : complexity > 50
                            ? '#f59e0b'
                            : '#10b981',
                      },
                    ]}
                  />
                </View>

                <View style={styles.complexityStats}>
                  <View style={styles.complexityStat}>
                    <Text style={styles.complexityStatLabel}>Optimization</Text>
                    <Text style={styles.complexityStatValue}>
                      {100 - complexity}%
                    </Text>
                  </View>
                  <View style={styles.complexityStat}>
                    <Text style={styles.complexityStatLabel}>Risk</Text>
                    <Text
                      style={[
                        styles.complexityStatValue,
                        {
                          color:
                            complexity > 75
                              ? '#ef4444'
                              : complexity > 50
                              ? '#f59e0b'
                              : '#10b981',
                        },
                      ]}
                    >
                      {complexity > 75 ? 'High' : complexity > 50 ? 'Medium' : 'Low'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>

              {complexity > 70 && (
                <View style={styles.recommendationItem}>
                  <MaterialCommunityIcons name="alert" size={16} color="#f59e0b" />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>
                      Consider breaking into smaller blueprints
                    </Text>
                    <Text style={styles.recommendationDesc}>
                      Your blueprint is becoming too complex. Consider splitting it.
                    </Text>
                  </View>
                </View>
              )}

              {fps < 40 && (
                <View style={styles.recommendationItem}>
                  <MaterialCommunityIcons name="alert-circle" size={16} color="#ef4444" />
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationTitle}>
                      Performance degradation detected
                    </Text>
                    <Text style={styles.recommendationDesc}>
                      Consider optimizing expensive nodes or reducing node count.
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.recommendationItem}>
                <MaterialCommunityIcons name="lightbulb" size={16} color="#10b981" />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Use node grouping</Text>
                  <Text style={styles.recommendationDesc}>
                    Group related nodes for better organization and performance.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
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
  panel: {
    position: 'absolute',
    right: 16,
    top: 60,
    width: 350,
    maxHeight: 600,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
    gap: 2,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: 9,
    color: '#64748b',
  },
  metricBar: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  profileItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 11,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  profileTime: {
    fontSize: 10,
    color: '#94a3b8',
  },
  profileBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  profileBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  profilePercentage: {
    fontSize: 9,
    color: '#64748b',
  },
  complexityBox: {
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  complexityMeter: {
    marginBottom: 10,
    position: 'relative',
  },
  complexityLabel: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  complexityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  complexityFill: {
    height: 24,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
  },
  complexityStats: {
    flexDirection: 'row',
    gap: 8,
  },
  complexityStat: {
    flex: 1,
    alignItems: 'center',
  },
  complexityStatLabel: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  complexityStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#06b6d4',
  },
  recommendationItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    marginBottom: 6,
    gap: 8,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  recommendationDesc: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
});
