import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Statistic {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function BlueprintAnalyticsPanel() {
  const [visible, setVisible] = useState(false);

  const statistics: Statistic[] = [
    { label: 'Total Nodes', value: 24, icon: 'cube', color: '#3b82f6', trend: 'up' },
    { label: 'Connections', value: 32, icon: 'connection', color: '#06b6d4', trend: 'stable' },
    { label: 'Variables', value: 8, icon: 'variable-box', color: '#10b981', trend: 'down' },
    { label: 'Functions', value: 3, icon: 'function', color: '#f59e0b', trend: 'stable' },
    { label: 'Events', value: 2, icon: 'bell', color: '#8b5cf6', trend: 'up' },
    { label: 'Avg Execution', value: '2.34ms', icon: 'clock', color: '#06b6d4', trend: 'down' },
  ];

  const nodeDistribution = [
    { type: 'Logic', count: 8, percentage: 33, color: '#3b82f6' },
    { type: 'Math', count: 5, percentage: 21, color: '#06b6d4' },
    { type: 'String', count: 4, percentage: 17, color: '#10b981' },
    { type: 'Array', count: 3, percentage: 13, color: '#f59e0b' },
    { type: 'Cast', count: 2, percentage: 8, color: '#8b5cf6' },
    { type: 'Other', count: 2, percentage: 8, color: '#64748b' },
  ];

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="chart-line" size={18} color="#fff" />
        <Text style={styles.buttonText}>Analytics</Text>
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
            {/* Key Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Statistics</Text>
              <View style={styles.statsGrid}>
                {statistics.map((stat, idx) => (
                  <View key={idx} style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                        <MaterialCommunityIcons
                          name={stat.icon as any}
                          size={16}
                          color="#fff"
                        />
                      </View>
                      {stat.trend && (
                        <MaterialCommunityIcons
                          name={
                            stat.trend === 'up'
                              ? 'trending-up'
                              : stat.trend === 'down'
                              ? 'trending-down'
                              : 'minus'
                          }
                          size={12}
                          color={
                            stat.trend === 'up'
                              ? '#10b981'
                              : stat.trend === 'down'
                              ? '#ef4444'
                              : '#64748b'
                          }
                        />
                      )}
                    </View>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Node Distribution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Node Distribution</Text>

              {nodeDistribution.map((dist, idx) => (
                <View key={idx} style={styles.distributionItem}>
                  <View style={styles.distributionHeader}>
                    <View style={styles.distributionLabel}>
                      <View
                        style={[styles.colorDot, { backgroundColor: dist.color }]}
                      />
                      <Text style={styles.distributionType}>{dist.type}</Text>
                    </View>
                    <Text style={styles.distributionCount}>{dist.count}</Text>
                  </View>
                  <View style={styles.distributionBar}>
                    <View
                      style={[
                        styles.distributionBarFill,
                        {
                          width: `${dist.percentage}%`,
                          backgroundColor: dist.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.distributionPercentage}>{dist.percentage}%</Text>
                </View>
              ))}
            </View>

            {/* Complexity Analysis */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Complexity Analysis</Text>

              <View style={styles.complexityGrid}>
                <View style={styles.complexityCard}>
                  <MaterialCommunityIcons name="layers" size={20} color="#3b82f6" />
                  <Text style={styles.complexityCardLabel}>Nesting Level</Text>
                  <Text style={styles.complexityCardValue}>3</Text>
                  <Text style={styles.complexityCardDesc}>Good</Text>
                </View>

                <View style={styles.complexityCard}>
                  <MaterialCommunityIcons name="shuffle-variant" size={20} color="#06b6d4" />
                  <Text style={styles.complexityCardLabel}>Branch Factor</Text>
                  <Text style={styles.complexityCardValue}>2.5</Text>
                  <Text style={styles.complexityCardDesc}>Optimal</Text>
                </View>

                <View style={styles.complexityCard}>
                  <MaterialCommunityIcons name="connection" size={20} color="#10b981" />
                  <Text style={styles.complexityCardLabel}>Avg Connections</Text>
                  <Text style={styles.complexityCardValue}>1.33</Text>
                  <Text style={styles.complexityCardDesc}>Good</Text>
                </View>

                <View style={styles.complexityCard}>
                  <MaterialCommunityIcons name="speedometer" size={20} color="#f59e0b" />
                  <Text style={styles.complexityCardLabel}>Complexity Score</Text>
                  <Text style={styles.complexityCardValue}>65%</Text>
                  <Text style={styles.complexityCardDesc}>Moderate</Text>
                </View>
              </View>
            </View>

            {/* Performance Insights */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Insights</Text>

              <View style={styles.insightItem}>
                <View style={[styles.insightDot, { backgroundColor: '#10b981' }]} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Good execution time</Text>
                  <Text style={styles.insightDesc}>
                    Average execution is 2.34ms, which is well within acceptable range
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={[styles.insightDot, { backgroundColor: '#f59e0b' }]} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Consider optimization</Text>
                  <Text style={styles.insightDesc}>
                    Some nodes could be cached to improve performance by 15%
                  </Text>
                </View>
              </View>

              <View style={styles.insightItem}>
                <View style={[styles.insightDot, { backgroundColor: '#3b82f6' }]} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Good organization</Text>
                  <Text style={styles.insightDesc}>
                    Node grouping and structure are well organized
                  </Text>
                </View>
              </View>
            </View>

            {/* Blueprint Health Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Blueprint Health</Text>

              <View style={styles.healthBox}>
                <View style={styles.healthScore}>
                  <Text style={styles.healthScoreValue}>78</Text>
                  <Text style={styles.healthScoreLabel}>/ 100</Text>
                </View>

                <View style={styles.healthMetrics}>
                  <View style={styles.healthMetric}>
                    <Text style={styles.healthMetricLabel}>Structure</Text>
                    <View style={styles.healthMetricBar}>
                      <View
                        style={[styles.healthMetricFill, { width: '85%' }]}
                      />
                    </View>
                  </View>

                  <View style={styles.healthMetric}>
                    <Text style={styles.healthMetricLabel}>Performance</Text>
                    <View style={styles.healthMetricBar}>
                      <View
                        style={[styles.healthMetricFill, { width: '72%' }]}
                      />
                    </View>
                  </View>

                  <View style={styles.healthMetric}>
                    <Text style={styles.healthMetricLabel}>Maintainability</Text>
                    <View style={styles.healthMetricBar}>
                      <View
                        style={[styles.healthMetricFill, { width: '78%' }]}
                      />
                    </View>
                  </View>
                </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  distributionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distributionType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  distributionCount: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  distributionBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  distributionPercentage: {
    fontSize: 10,
    color: '#64748b',
  },
  complexityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  complexityCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  complexityCardLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 6,
    marginBottom: 4,
  },
  complexityCardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#06b6d4',
  },
  complexityCardDesc: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  insightItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    marginBottom: 8,
    gap: 10,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  insightDesc: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  healthBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  healthScore: {
    alignItems: 'center',
    marginBottom: 16,
  },
  healthScoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
  },
  healthScoreLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  healthMetrics: {
    gap: 10,
  },
  healthMetric: {
    marginBottom: 8,
  },
  healthMetricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 4,
  },
  healthMetricBar: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  healthMetricFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 3,
  },
});
