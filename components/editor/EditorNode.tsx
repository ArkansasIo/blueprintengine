import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlueprintNode, BlueprintPin } from '@/app/utils/ue5-blueprint-generator';

interface EditorNodeProps {
  node: BlueprintNode;
  isSelected?: boolean;
  onPress?: () => void;
  onPinPress?: (pinId: string) => void;
}

const EditorNode: React.FC<EditorNodeProps> = ({
  node,
  isSelected = false,
  onPress,
  onPinPress,
}) => {
  // Categorize pins by direction
  const { inputPins, outputPins } = useMemo(() => {
    return {
      inputPins: node.pins.filter((p) => p.direction === 'Input'),
      outputPins: node.pins.filter((p) => p.direction === 'Output'),
    };
  }, [node.pins]);

  const getNodeColor = () => {
    if (node.color) return node.color;

    // Default colors by node type
    const colors: Record<string, string> = {
      Event: '#ef4444',
      Branch: '#f59e0b',
      ForLoop: '#f59e0b',
      Sequence: '#f59e0b',
      FunctionCall: '#3b82f6',
      PureFunctionCall: '#3b82f6',
      GetVariable: '#8b5cf6',
      SetVariable: '#8b5cf6',
      Comment: '#10b981',
      Delay: '#06b6d4',
    };

    return colors[node.type] || '#3b82f6';
  };

  const getPinColor = (pinType: string) => {
    const colors: Record<string, string> = {
      exec: '#ffffff',
      bool: '#4ade80',
      int32: '#60a5fa',
      float: '#f87171',
      string: '#a78bfa',
      FVector: '#fbbf24',
      FRotator: '#fbbf24',
      Object: '#06b6d4',
    };
    return colors[pinType] || '#9ca3af';
  };

  const nodeColor = getNodeColor();

  return (
    <Pressable
      style={[
        styles.container,
        {
          borderColor: nodeColor,
          backgroundColor: nodeColor + '15',
          borderWidth: isSelected ? 2 : 1,
          shadowColor: isSelected ? nodeColor : '#000000',
        },
      ]}
      onPress={onPress}
    >
      {/* Node Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: nodeColor + '30' },
        ]}
      >
        <View style={styles.titleSection}>
          <View
            style={[
              styles.typeIcon,
              { backgroundColor: nodeColor },
            ]}
          >
            <MaterialCommunityIcons
              name="cube-outline"
              size={12}
              color="#ffffff"
            />
          </View>
          <Text style={styles.nodeTitle} numberOfLines={1}>
            {node.label || node.name}
          </Text>
        </View>
      </View>

      {/* Node Body */}
      <View style={styles.body}>
        {/* Left Side: Input Pins */}
        <View style={styles.pinsColumn}>
          {inputPins.length > 0 ? (
            inputPins.map((pin) => (
              <Pressable
                key={pin.id}
                style={styles.pinRow}
                onPress={() => onPinPress?.(pin.id)}
              >
                <View
                  style={[
                    styles.pinDot,
                    { backgroundColor: getPinColor(pin.type) },
                  ]}
                />
                <Text style={styles.pinLabel} numberOfLines={1}>
                  {pin.name}
                </Text>
              </Pressable>
            ))
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>

        {/* Center: Content */}
        <View style={styles.content}>
          {node.comment && (
            <Text style={styles.comment} numberOfLines={2}>
              {node.comment}
            </Text>
          )}
        </View>

        {/* Right Side: Output Pins */}
        <View style={[styles.pinsColumn, styles.rightPins]}>
          {outputPins.length > 0 ? (
            outputPins.map((pin) => (
              <Pressable
                key={pin.id}
                style={styles.pinRow}
                onPress={() => onPinPress?.(pin.id)}
              >
                <Text style={[styles.pinLabel, styles.rightPinLabel]} numberOfLines={1}>
                  {pin.name}
                </Text>
                <View
                  style={[
                    styles.pinDot,
                    { backgroundColor: getPinColor(pin.type) },
                  ]}
                />
              </Pressable>
            ))
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>
      </View>

      {/* Selection Border (UE5 style) */}
      {isSelected && (
        <View style={[styles.selectionBorder, { borderColor: nodeColor }]} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 140,
    borderRadius: 4,
    overflow: 'hidden',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  typeIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nodeTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
    flex: 1,
  },

  body: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: 8,
  },

  pinsColumn: {
    justifyContent: 'flex-start',
    gap: 4,
  },

  rightPins: {
    alignItems: 'flex-end',
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
    height: 20,
  },

  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pinLabel: {
    fontSize: 9,
    color: '#cbd5e1',
    maxWidth: 80,
  },

  rightPinLabel: {
    textAlign: 'right',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: 4,
  },

  comment: {
    fontSize: 8,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderRadius: 4,
    pointerEvents: 'none',
  },
});

export default EditorNode;