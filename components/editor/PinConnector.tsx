import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlueprintPin } from '@/app/utils/ue5-blueprint-generator';

interface PinConnectorProps {
  pin: BlueprintPin;
  nodePosition: { x: number; y: number };
  onConnectionStart?: (pinId: string, position: { x: number; y: number }) => void;
  onConnectionMove?: (position: { x: number; y: number }) => void;
  onConnectionEnd?: () => void;
  isConnected?: boolean;
}

const PinConnector: React.FC<PinConnectorProps> = ({
  pin,
  nodePosition,
  onConnectionStart,
  onConnectionMove,
  onConnectionEnd,
  isConnected = false,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsConnecting(true);
        onConnectionStart?.(pin.id, nodePosition);
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        onConnectionMove?.({
          x: nodePosition.x + gestureState.dx,
          y: nodePosition.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        setIsConnecting(false);
        onConnectionEnd?.();
      },
    })
  ).current;

  const getPinColor = () => {
    const colors: Record<string, string> = {
      exec: '#ffffff',
      bool: '#4ade80',
      int32: '#60a5fa',
      float: '#f87171',
      string: '#a78bfa',
      FVector: '#fbbf24',
      Object: '#06b6d4',
    };
    return colors[pin.type] || '#9ca3af';
  };

  const pinColor = getPinColor();

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
    >
      {/* Pin Dot */}
      <Pressable
        style={[
          styles.pinDot,
          {
            backgroundColor: pinColor,
            borderColor: isConnecting ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
            shadowColor: isConnecting ? pinColor : undefined,
            shadowOffset: isConnecting ? { width: 0, height: 0 } : undefined,
            shadowOpacity: isConnecting ? 0.8 : 0,
            shadowRadius: isConnecting ? 8 : 0,
            elevation: isConnecting ? 5 : 0,
          },
        ]}
      >
        {isConnecting && (
          <View style={[styles.pulseRing, { borderColor: pinColor }]} />
        )}
      </Pressable>

      {/* Tooltip on Hover */}
      {isConnecting && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {pin.name} ({pin.type})
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 10,
  },

  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    top: -4,
    left: -4,
    opacity: 0.6,
  },

  tooltip: {
    position: 'absolute',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 100,
    zIndex: 20,
    left: 20,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  tooltipText: {
    fontSize: 9,
    color: '#cbd5e1',
    fontWeight: '500',
  },
});

export default PinConnector;