import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useEditorStore } from '../app/stores/editor-store';
import { useHistoryStore } from '../app/stores/history-store';
import { duplicateNode } from '../app/utils/node-duplicator';

export function useKeyboardShortcuts() {
  const editorStore = useEditorStore();
  const historyStore = useHistoryStore();

  useEffect(() => {
    // Only works on web/desktop
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isMac = metaKey;
      const isCtrl = ctrlKey || (isMac && metaKey);

      // Undo (Ctrl+Z / Cmd+Z)
      if (isCtrl && key === 'z' && !shiftKey) {
        event.preventDefault();
        historyStore.undo();
        return;
      }

      // Redo (Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y)
      if ((isCtrl && shiftKey && key === 'z') || (isCtrl && key === 'y')) {
        event.preventDefault();
        historyStore.redo();
        return;
      }

      // Delete (Delete or Backspace)
      if (key === 'Delete' || key === 'Backspace') {
        event.preventDefault();
        if (editorStore.selectedNodeId) {
          editorStore.deleteNode(editorStore.selectedNodeId);
        } else if (editorStore.selectedEdgeId) {
          editorStore.deleteEdge(editorStore.selectedEdgeId);
        }
        return;
      }

      // Duplicate (Ctrl+D / Cmd+D)
      if (isCtrl && key === 'd') {
        event.preventDefault();
        if (editorStore.selectedNodeId) {
          const nodeToClone = editorStore.nodes.find((n) => n.id === editorStore.selectedNodeId);
          if (nodeToClone) {
            const duplicated = duplicateNode(nodeToClone);
            editorStore.addNode(duplicated);
          }
        }
        return;
      }

      // Select All (Ctrl+A / Cmd+A)
      if (isCtrl && key === 'a') {
        event.preventDefault();
        editorStore.selectAllNodes();
        return;
      }

      // Deselect (Escape)
      if (key === 'Escape') {
        event.preventDefault();
        editorStore.deselectAll();
        return;
      }

      // Copy (Ctrl+C / Cmd+C)
      if (isCtrl && key === 'c') {
        event.preventDefault();
        editorStore.copySelected();
        return;
      }

      // Paste (Ctrl+V / Cmd+V)
      if (isCtrl && key === 'v') {
        event.preventDefault();
        editorStore.pasteNodes();
        return;
      }

      // Compile (Ctrl+Shift+B / Cmd+Shift+B)
      if (isCtrl && shiftKey && key === 'b') {
        event.preventDefault();
        editorStore.compileBlueprint();
        return;
      }

      // Search (Ctrl+F / Cmd+F)
      if (isCtrl && key === 'f') {
        event.preventDefault();
        editorStore.openSearch();
        return;
      }

      // Pan with Arrow Keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        const delta = 20;
        switch (key) {
          case 'ArrowUp':
            editorStore.pan({ x: 0, y: delta });
            break;
          case 'ArrowDown':
            editorStore.pan({ x: 0, y: -delta });
            break;
          case 'ArrowLeft':
            editorStore.pan({ x: delta, y: 0 });
            break;
          case 'ArrowRight':
            editorStore.pan({ x: -delta, y: 0 });
            break;
        }
      }

      // Zoom (Ctrl+Scroll / Ctrl+Plus/Minus)
      if (isCtrl && (key === '+' || key === '=' || key === '-')) {
        event.preventDefault();
        const currentZoom = editorStore.zoom || 1;
        if (key === '+' || key === '=') {
          editorStore.setZoom(Math.min(currentZoom + 0.1, 3));
        } else {
          editorStore.setZoom(Math.max(currentZoom - 0.1, 0.5));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorStore, historyStore]);
}