import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import DraggableNode from './DraggableNode';
import EdgeRenderer from './EdgeRenderer';
import LiveConnectionRenderer from './LiveConnectionRenderer';
import ConnectionHints from './ConnectionHints';
import CanvasControls from './CanvasControls';
import QuickActionsMenu from './QuickActionsMenu';
import SelectionIndicator from './SelectionIndicator';

export default function EditorCanvas() {
  const { nodes, edges, pan, zoom, setPan, setZoom } = useEditorStore();
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setPan({
          x: pan.x + gestureState.dx,
          y: pan.y + gestureState.dy,
        });
      },
    })
  ).current;

  return (
    <View
      style={styles.container}
      onLayout={(e) =>
        setCanvasSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
      {...panResponder.panHandlers}
    >
      {/* Background Grid */}
      <View style={styles.grid} />

      {/* Selection Indicator */}
      <SelectionIndicator />

      {/* Live Connection Renderer */}
      <LiveConnectionRenderer />

      {/* Connection Hints */}
      <ConnectionHints />

      {/* Canvas Controls */}
      <CanvasControls />

      {/* Quick Actions Menu */}
      <QuickActionsMenu />

      {/* Canvas Content */}
      <View
        style={[
          styles.content,
          {
            left: pan.x,
            top: pan.y,
            width: 2000 * (zoom || 1),
            height: 2000 * (zoom || 1),
          },
        ]}
      >
        {/* Render Edges First (Behind Nodes) */}
        <EdgeRenderer selectedEdgeId={undefined} />

        {/* Render Nodes */}
        {nodes.map((node) => (
          <DraggableNode key={node.id} node={node} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
  },
  content: {
    position: 'absolute',
    width: 2000,
    height: 2000,
  },
});