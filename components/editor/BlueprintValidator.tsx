import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';
import { BlueprintClass } from '@/app/utils/ue5-blueprint-generator';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

interface BlueprintValidatorProps {
  blueprint: BlueprintClass | null;
  onIssueClick?: (issue: ValidationIssue) => void;
}

const BlueprintValidator: React.FC<BlueprintValidatorProps> = ({
  blueprint,
  onIssueClick,
}) => {
  const issues = useMemo(() => {
    if (!blueprint) return [];

    const validationIssues: ValidationIssue[] = [];

    // Check for orphaned nodes (nodes with no connections)
    blueprint.eventGraphNodes.forEach((node) => {
      const hasConnections = blueprint.eventGraphEdges.some(
        (edge) => edge.fromNodeId === node.id || edge.toNodeId === node.id
      );

      if (!hasConnections && node.type !== 'Event') {
        validationIssues.push({
          id: `orphan-${node.id}`,
          type: 'warning',
          message: `Node "${node.label}" has no connections`,
          nodeId: node.id,
        });
      }
    });

    // Check for circular references
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const connectedNodes = blueprint.eventGraphEdges
        .filter((e) => e.fromNodeId === nodeId)
        .map((e) => e.toNodeId);

      for (const nextId of connectedNodes) {
        if (!visited.has(nextId)) {
          if (hasCycle(nextId)) return true;
        } else if (recursionStack.has(nextId)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    blueprint.eventGraphNodes.forEach((node) => {
      visited.clear();
      recursionStack.clear();

      if (hasCycle(node.id)) {
        validationIssues.push({
          id: `cycle-${node.id}`,
          type: 'error',
          message: `Circular reference detected in node "${node.label}"`,
          nodeId: node.id,
        });
      }
    });

    // Check for type mismatches in connections
    blueprint.eventGraphEdges.forEach((edge) => {
      const fromNode = blueprint.eventGraphNodes.find((n) => n.id === edge.fromNodeId);
      const toNode = blueprint.eventGraphNodes.find((n) => n.id === edge.toNodeId);

      if (fromNode && toNode) {
        const fromPin = fromNode.pins.find((p) => p.id === edge.fromPinId);
        const toPin = toNode.pins.find((p) => p.id === edge.toPinId);

        if (fromPin && toPin) {
          // Check pin type compatibility
          const isCompatible =
            fromPin.type === toPin.type ||
            fromPin.type === 'Object' ||
            toPin.type === 'Object';

          if (!isCompatible) {
            validationIssues.push({
              id: `type-mismatch-${edge.id}`,
              type: 'error',
              message: `Type mismatch: ${fromPin.type} -> ${toPin.type}`,
              edgeId: edge.id,
            });
          }
        }
      }
    });

    // Check for unconnected inputs
    blueprint.eventGraphNodes.forEach((node) => {
      const requiredInputs = node.pins.filter(
        (p) => p.direction === 'Input' && p.type !== 'exec'
      );

      requiredInputs.forEach((inputPin) => {
        const isConnected = blueprint.eventGraphEdges.some(
          (e) => e.toPinId === inputPin.id
        );

        if (!isConnected) {
          validationIssues.push({
            id: `unconnected-input-${inputPin.id}`,
            type: 'info',
            message: `Input pin "${inputPin.name}" on "${node.label}" is not connected`,
            nodeId: node.id,
          });
        }
      });
    });

    // Check for invalid variable references
    blueprint.variables.forEach((variable) => {
      // Check if variable is actually used
      const isUsed = blueprint.eventGraphNodes.some((node) =>
        node.label.includes(variable.name)
      );

      if (!isUsed) {
        validationIssues.push({
          id: `unused-variable-${variable.id}`,
          type: 'warning',
          message: `Variable "${variable.name}" is not used`,
        });
      }
    });

    return validationIssues;
  }, [blueprint]);

  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;
  const infoCount = issues.filter((i) => i.type === 'info').length;

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return { icon: 'alert-circle', color: '#ef4444' };
      case 'warning':
        return { icon: 'alert', color: '#f59e0b' };
      case 'info':
        return { icon: 'information', color: '#06b6d4' };
      default:
        return { icon: 'information', color: '#cbd5e1' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summary}>
        {errorCount > 0 && (
          <View style={[styles.summaryItem, styles.errorItem]}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={16}
              color="#ef4444"
            />
            <Text style={styles.summaryText}>{errorCount} Errors</Text>
          </View>
        )}
        {warningCount > 0 && (
          <View style={[styles.summaryItem, styles.warningItem]}>
            <MaterialCommunityIcons
              name="alert"
              size={16}
              color="#f59e0b"
            />
            <Text style={styles.summaryText}>{warningCount} Warnings</Text>
          </View>
        )}
        {infoCount > 0 && (
          <View style={[styles.summaryItem, styles.infoItem]}>
            <MaterialCommunityIcons
              name="information"
              size={16}
              color="#06b6d4"
            />
            <Text style={styles.summaryText}>{infoCount} Info</Text>
          </View>
        )}

        {issues.length === 0 && (
          <View style={styles.successItem}>
            <MaterialCommunityIcons
              name="check-circle"
              size={16}
              color="#10b981"
            />
            <Text style={styles.summaryText}>No issues found</Text>
          </View>
        )}
      </View>

      {/* Issues List */}
      {issues.length > 0 && (
        <ScrollView style={styles.issuesList}>
          {issues.map((issue) => {
            const { icon, color } = getIssueIcon(issue.type);

            return (
              <Pressable
                key={issue.id}
                style={[
                  styles.issueItem,
                  issue.type === 'error' && styles.errorBg,
                  issue.type === 'warning' && styles.warningBg,
                  issue.type === 'info' && styles.infoBg,
                ]}
                onPress={() => onIssueClick?.(issue)}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={14}
                  color={color}
                  style={styles.issueIcon}
                />
                <Text style={styles.issueMessage} numberOfLines={2}>
                  {issue.message}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },

  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },

  errorItem: {
    backgroundColor: '#7c2d12',
  },

  warningItem: {
    backgroundColor: '#78350f',
  },

  infoItem: {
    backgroundColor: '#0c4a6e',
  },

  successItem: {
    backgroundColor: '#064e3b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },

  summaryText: {
    fontSize: 11,
    color: '#e2e8f0',
    fontWeight: '500',
  },

  issuesList: {
    maxHeight: 150,
  },

  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 41, 59, 0.5)',
    gap: 8,
  },

  errorBg: {
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
  },

  warningBg: {
    backgroundColor: 'rgba(120, 53, 15, 0.2)',
  },

  infoBg: {
    backgroundColor: 'rgba(12, 74, 110, 0.2)',
  },

  issueIcon: {
    marginTop: 2,
    flexShrink: 0,
  },

  issueMessage: {
    flex: 1,
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
  },
});

export default BlueprintValidator;
