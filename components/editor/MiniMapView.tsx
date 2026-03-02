import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MinimapNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isSelected: boolean;
}

interface MinimapEdge {
  from: string;
  to: string;
  color: string;
}

export default function MiniMapView() {
  const [expanded, setExpanded] = useState(true);
  const [nodes] = useState<MinimapNode[]>([
    {
      id: 'node1',
      x: 50,
      y: 50,
      width: 15,
      height: 15,
      color: '#3b82f6',
      isSelected: true,
    },
    {
      id: 'node2',
      x: 150,
      y: 100,
      width: 15,
      height: 15,
      color: '#06b6d4',
      isSelected: false,
    },
    {
      id: 'node3',
      x: 250,
      y: 80,
      width: 15,
      height: 15,
      color: '#10b981',
      isSelected: false,
    },
    {
      id: 'node4',
      x: 100,
      y: 200,
      width: 15,
      height: 15,
      color: '#f59e0b',
      isSelected: false,
    },
    {
      id: 'node5',
      x: 200,
      y: 220,
      width: 15,
      height: 15,
      color: '#8b5cf6',
      isSelected: false,
    },
  ]);

  const [edges] = useState<MinimapEdge[]>([
    { from: 'node1', to: 'node2', color: '#334155' },
    { from: 'node2', to: 'node3', color: '#334155' },
    { from: 'node1', to: 'node4', color: '#334155' },
    { from: 'node4', to: 'node5', color: '#334155' },
  ]);

  const [viewportRect] = useState({ x: 40, y: 40, width: 60, height: 60 });

  if (!expanded) {
    return (
      <View style={styles.collapsedContainer}>
        <Pressable
          style={styles.expandButton}
          onPress={() => setExpanded(true)}
        >
          <MaterialCommunityIcons name="map-outline" size={18} color="#06b6d4" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mini Map</Text>
        <Pressable onPress={() => setExpanded(false)}>
          <MaterialCommunityIcons name="minus" size={16} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapGrid}>
          {/* Draw edges */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);

            if (!fromNode || !toNode) return null;

            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height / 2;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y + toNode.height / 2;

            return (
              <View
                key={`edge-${idx}`}
                style={[
                  styles.edgeLine,
                  {
                    left: Math.min(fromX, toX),
                    top: Math.min(fromY, toY),
                    width: Math.abs(toX - fromX),
                    height: Math.abs(toY - fromY),
                    borderColor: edge.color,
                  },
                ]}
              />
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <Pressable
              key={node.id}
              style={[
                styles.node,
                {
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  backgroundColor: node.color,
                  borderWidth: node.isSelected ? 2 : 1,
                  borderColor: node.isSelected ? '#06b6d4' : node.color,
                  opacity: node.isSelected ? 1 : 0.6,
                },
              ]}
            />
          ))}

          {/* Draw viewport indicator */}
          <View
            style={[
              styles.viewport,
              {
                left: viewportRect.x,
                top: viewportRect.y,
                width: viewportRect.width,
                height: viewportRect.height,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Nodes</Text>
          <Text style={styles.statValue}>{nodes.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Edges</Text>
          <Text style={styles.statValue}>{edges.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Zoom</Text>
          <Text style={styles.statValue}>100%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 220,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
  },
  collapsedContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  mapGrid: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    margin: 8,
    borderRadius: 4,
    position: 'relative',
  },
  edgeLine: {
    position: 'absolute',
    borderWidth: 1,
  },
  node: {
    position: 'absolute',
    borderRadius: 2,
  },
  viewport: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#0f172a',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#06b6d4',
    marginTop: 2,
  },
});
