import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { useEditorStore } from '@/app/stores/editor-store';
import EditorNode from './EditorNode';
import { BlueprintNode } from '@/app/utils/ue5-blueprint-generator';

interface DraggableNodeProps {
  node: BlueprintNode;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ node }) => {
  const { selectNode, updateNodePosition, selectedNodes } = useEditorStore();
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isSelected = selectedNodes.includes(node.id);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        selectNode(node.id);
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setDragOffset({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        updateNodePosition(node.id, {
          x: node.position.x + gestureState.dx,
          y: node.position.y + gestureState.dy,
        });
        setDragOffset({ x: 0, y: 0 });
      },
    })
  ).current;

  const handleNodePress = () => {
    selectNode(node.id);
  };

  const handlePinPress = (pinId: string) => {
    console.log('Pin pressed:', pinId);
  };

  return (
    <View
      style={[
        styles.container,
        {
          left: node.position.x + dragOffset.x,
          top: node.position.y + dragOffset.y,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <EditorNode
        node={node}
        isSelected={isSelected}
        onPress={handleNodePress}
        onPinPress={handlePinPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default DraggableNode;